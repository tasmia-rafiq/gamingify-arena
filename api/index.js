//using Express
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Post = require('./models/Post');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const multer = require('multer');
const uploadMiddleware = multer({
    dest: '/tmp',
    limits: { fileSize: 10 * 1024 * 1024, },
}).single('file'); //I removed this because we need to deploy this code to vercel and it does not allow to store in upload files
//to rename file
const fs = require('fs');

// to encrypt password
const salt = bcrypt.genSaltSync(10);
const bucket = 'gamingify-arena-app';

// for jwt
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: 'https://gamingify-arena.vercel.app' }));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://gamingify-arena.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); //this method serves files (like images, stylesheets, scripts, etc.) directly to the client without needing to create explicit routes for each file. Instead, you define a single route that serves static files from a designated directory.

//connecting MongoDB

// creating function to connct with s3 bucket aws
async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }));

    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

//register
app.post('/api/register', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const { username, password } = req.body;

    //creating user
    try {
        //if username is unique, it will register a new user
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        //if user is not unique, exception
        res.status(400).json(e);
    }

});

//login
app.post('/api/login', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const { username, password } = req.body;

    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);

    // Session / token
    if (passOk) {
        //logged in (response with json web token)
        //creating token
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
        //in the above callback function, we get and error if there's an error and a token if no error
    } else {
        res.status(400).json('Wrong credentials.')
    }
});

//profile
app.get('/api/profile', (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    // getting token
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

//logout
app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// create post
app.post('/api/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        console.log('Entering /api/post route');

        mongoose.connect(process.env.MONGODB_URI);
        //to upload the file from req body, we will use Multer (a middleware used to handle files upload)

        const { originalname, path, mimetype } = req.file;
        const url = await uploadToS3(path, originalname, mimetype);

        //creating post in DB

        //getting token so that we can get the user Id
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;
            const { title, summary, category, content } = req.body;
            const categoryDoc = await Category.findOne({ category_title: category });
            if (!categoryDoc) {
                return res.status(400).json('Category not found');
            }
            const postDoc = await Post.create({
                title,
                summary,
                category: categoryDoc._id,
                content,
                coverImg: url,
                author: info.id,
            });
            res.json(postDoc);
        });

    } catch (error) {
        console.error('Error in /api/post route:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});


//display posts
app.get('/api/post', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Adjust as needed
    const skip = (page - 1) * limit;

    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    res.json(posts);
});

//single post page
app.get('/api/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']).populate('category', ['category_title']);
    res.json(postDoc);
});

// navigation menu category listing
app.get('/api/category', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Fetch category title by ID
app.get('/api/category/:categoryId', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const categoryId = req.params.categoryId;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json('Category not found');
        }
        res.json(category.category_title);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch category posts
app.get('/api/:categoryId/posts', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const { categoryId } = req.params;

    try {
        const posts = await Post.find({ category: categoryId })
            .populate('author', ['username'])
            .populate('category', ['category_title']) // Populate the 'category' field
            .lean();

        if (!posts) {
            return res.status(404).json('No posts found for this category');
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// display profile's posts
app.get('/api/:userID/userPosts', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const userID = req.params.userID;
    console.log('Requested userID:', userID);

    try {
        const posts = await Post.find({ author: userID })
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .lean();

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json('Internal Server Error Oops!');
    }
});

// display author posts
app.get('/api/profile/:authorID', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const authorID = req.params.authorID;
    console.log('Requested authorID:', authorID);

    try {
        const posts = await Post.find({ author: authorID })
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .lean();

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json('Internal Server Error Oops!');
    }
})


// Editing Post
app.put('/api/post', uploadMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    let url = null;
    if (req.file) {
        const { originalname, path, mimetype } = req.file;
        url = await uploadToS3(path, originalname, mimetype);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        const { id, title, summary, category, content } = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if (!isAuthor) {
            return res.status(400).json('You are not the Author');
        }

        // Update the document fields
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.category = category;
        postDoc.content = content;
        if (url) {
            postDoc.coverImg = url;
        }

        // Save the updated document
        await postDoc.save();

        res.json(postDoc);
    });

});

// delete post
app.delete('/api/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const postId = req.params.id;
    const { token } = req.cookies;

    try {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;

            const postDoc = await Post.findById(postId);

            if (!postDoc) {
                return res.status(404).json('Post not found');
            }

            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

            if (!isAuthor) {
                return res.status(400).json('You are not the Author');
            }

            await Post.findByIdAndRemove(postId);
            res.json('Post deleted successfully');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('Internal Server Error');
    }
});

// Add this middleware at the end of your middleware and routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});


app.listen(4000);

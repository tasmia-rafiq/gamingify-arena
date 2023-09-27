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
const multer = require('multer');
const uploadMiddleware = multer({
    dest: 'uploads/',
    limits: { fileSize: 40 * 1024 * 1024, },
});
//to rename file
const fs = require('fs');

// to encrypt password
const salt = bcrypt.genSaltSync(10);

// for jwt
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads')); //this method serves files (like images, stylesheets, scripts, etc.) directly to the client without needing to create explicit routes for each file. Instead, you define a single route that serves static files from a designated directory.

//connecting MongoDB
const mongodbURI = process.env.MONGODB_URI;
mongoose.connect(mongodbURI);

//register
app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
app.get('/profile', (req, res) => {
    // getting token
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

//logout
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// create post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    //to upload the file from req body, we will use Multer (a middleware used to handle files upload)

    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

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
            coverImg: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
});


//display posts
app.get('/post', async (req, res) => {
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
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']).populate('category', ['category_title']);
    res.json(postDoc);
});

// navigation menu category listing
app.get('/category', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Fetch category title by ID
app.get('/category/:categoryId', async (req, res) => {
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
app.get('/:categoryId/posts', async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        // Assuming 'category' field in Post model is an ObjectId reference to Category model
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





// Editing Post
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
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
        if (newPath) {
            postDoc.coverImg = newPath;
        }

        // Save the updated document
        await postDoc.save();

        res.json(postDoc);
    });

});

// delete post
app.delete('/post/:id', async (req, res) => {
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

app.listen(4000);

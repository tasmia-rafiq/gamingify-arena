const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const PostSchema = new Schema({
    title: String,
    summary: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    content: String,
    coverImg: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
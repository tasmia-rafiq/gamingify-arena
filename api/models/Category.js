const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CategorySchema = new Schema({
  category_title: String,
});

const CategoryModel = model('Category', CategorySchema);

module.exports = CategoryModel;

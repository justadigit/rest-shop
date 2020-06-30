const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{timestamps:true});

let Product = mongoose.model('Product',productSchema);

module.exports = Product;
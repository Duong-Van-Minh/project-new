let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
})
let category = mongoose.model('category', categorySchema);

module.exports = category;



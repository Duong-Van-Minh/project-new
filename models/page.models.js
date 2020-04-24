let mongoose = require('mongoose');

let pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
	content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number,
        required: true
    }
})
let page = mongoose.model('page', pageSchema);

module.exports = page;



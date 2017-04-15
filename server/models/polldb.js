let mongoose = require('mongoose');

// create a model class
let contactSchema = mongoose.Schema({
    question: String,
    option: String,
    option1: String,
    option2: String,
    option3: String
}, {
    collection: "polldb"
});

module.exports = mongoose.model('polldb', contactSchema);
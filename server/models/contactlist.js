let mongoose = require('mongoose');

// create a model class
let contactSchema = mongoose.Schema({
    name: String,
    phone: String,
    email: String
}, {
    collection: "contactlist"
});

module.exports = mongoose.model('contactlist', contactSchema);
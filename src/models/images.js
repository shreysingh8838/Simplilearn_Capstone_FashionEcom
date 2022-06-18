const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    link: {type:String}
});

// custom validation
// productSchema.path('proPrice').validate((val) => {
//        numberregex = /^[0-9]+$/;
//        return numberregex.test(val);
// }, 'Invalid Price');

module.exports = mongoose.model('image', schema);
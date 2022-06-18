const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: Object, required: true},
    name : {type: String, required: true}, 

});

// custom validation
// productSchema.path('proPrice').validate((val) => {
//        numberregex = /^[0-9]+$/;
//        return numberregex.test(val);
// }, 'Invalid Price');

module.exports = mongoose.model('Order', schema);
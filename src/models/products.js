const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
       proCompany: {
              type: String,
              
       },
       proTitle: {
              type: String,
              
       },
       proPrice: {
              type: Number,
              required: false
              
       },
       proGender: {
              type: String,
              
       },
       proDes: {
              type: String,  
       },
       proImg:{
                     type: String,
              }
});

// custom validation
// productSchema.path('proPrice').validate((val) => {
//        numberregex = /^[0-9]+$/;
//        return numberregex.test(val);
// }, 'Invalid Price');



const Product = mongoose.model('Product', productSchema);
module.exports = Product;
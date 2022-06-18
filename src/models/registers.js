const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname :{
        type : String,
        
    },
    email : {
        type : String,
        
        unique : true
    },
    phone : {
        type : Number,
        
        unique : true
    },
    password : {
        type :String,
        required : true
        
    },
    cpassword : {
        type : String,
        required : true
        
    }

});


// we need to creat collection

const Register = mongoose.model('Register', userSchema);

module.exports = Register;
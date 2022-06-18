const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://user:user@cluster0.irulw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(()=>{
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.log("Error: ", err.message);
});
require('../models/passport');
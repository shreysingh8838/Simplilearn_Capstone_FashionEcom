var image = require('../models/images');
var mongoose=require('mongoose');
const { exists } = require('./registers');
mongoose.connect('mongodb://localhost:27017/fashionRegister')

var images = [
    new image({
        link:'https://i.ibb.co/jG8rjgf/p14.jpg'
    }),
    new image({
        link:"https://i.ibb.co/nMkg6kF/p13.jpg"
    }),
    new image({
        link:"https://i.ibb.co/rbJQCGs/p12.jpg"
    }),
    new image({
        link:"https://i.ibb.co/StJhZRG/p11.jpg"
    }),
    new image({
        link:"https://i.ibb.co/H4gXTZh/p9.jpg"
    }),
    new image({
        link:"https://i.ibb.co/fxY0j1r/p7.png"
    }),
    new image({
        link:"https://i.ibb.co/cQYbHVy/p8.jpg"
    }),
    new image({
        link:"https://i.ibb.co/fNKKbBv/p6.jpg"
    }),
    new image({
        link:"https://i.ibb.co/8cxm8Vg/p5.jpg"
    }),
    new image({
        link:"https://i.ibb.co/Lrd0dmD/p4.jpg"
    }),
    new image({
        link:"https://i.ibb.co/2YvxKBg/p3.jpg"
    }),
    new image({
        link:"https://i.ibb.co/F4rrcvR/p2.jpg"
    }),
    new image({
        link:"https://i.ibb.co/Dgthpq2/p1.jpg"
    }),
    new image({
        link:"https://i.ibb.co/7Jbcywh/10.jpg"
    }),
];
var done =0
for(var i=0; i<images.length; i++){

    images[i].save(function(err,result){
        done++;
        if(done === images.length){
            exit();
        }
    });
};
function exit(){

    mongoose.disconnect();
}

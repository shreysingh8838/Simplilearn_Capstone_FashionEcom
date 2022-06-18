const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const path = require('path');
const hbs = require('hbs');

var session = require('express-session');
var csrf = require('csurf');
const register = require('./models/registers');

const Cart = require('./models/cart');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo');
var passport = require('passport');
const validator = require('express-validator');
var flash = require('connect-flash');
const product = require('./models/products');
const image = require('./models/images')
var stripe = require("stripe")("sk_test_51L74AhSGmemSdne0DtS2B2AIWiqXRbfjkX3UI4RpJSTAfZ0Y5BJ0naRsoebfTR5pmwYU8rsq8aNWxMRV4waf6jiW00YdxlBRCS");
var csrfProtection = csrf();






// router modeule
const productcontroller = require('../controllers/productController');
const { default: mongoose } = require('mongoose');


app.use('/product', productcontroller);

var router = express.Router();
require('./db/conn');


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");

const partial_path = path.join(__dirname, "../templates/partials");

//get the data from user to data base without useing postman
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
//get the data from user to data base without useing postman *
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);
app.use(cookieParser({}));
app.use(session({ secret: 'shreyas', resave: false, saveUninitialized: false }));
app.use(csrfProtection);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
var Order = require('./models/order');
// var Cart = require('./models/cart');

const a = app.use(express.static(path.join(__dirname, "../public")));
const b = app.use(express.static(path.join(__dirname, "../src")));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://shreyas05:Shreyas123@cluster0.96jxps0.mongodb.net/fashionRegister?retryWrites=true&w=majority' }),
    cookie: { maxAge: 180 * 60 * 1000 },
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
require('./models/passport.js');

app.get("", (req, res) => {
    product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render("index.hbs", { products: productChunks });
    })

});
app.get("/index.hbs", (req, res) => {
    product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render("index", { products: productChunks });
    })
});
app.get("/register", (req, res) => {
    var messages = req.flash('error');
    res.render("register", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
app.get("/register.hbs", (req, res) => {
    var messages = req.flash('error');
    res.render("register", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

app.get("/login", (req, res) => {
    var messages = req.flash('error');
    res.render("login", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
app.get("/shop.hbs", (req, res) => {
    product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        image.find(function (err, doc) {
            res.render("shop", { products: productChunks, iges: doc[1] });
            console.log(doc[1]);
        });
        // res.render("shop", {products: productChunks});
    });

});
app.get("/sproducts.hbs", (req, res) => {
    product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render("sproducts", { products: productChunks });
    })
});
app.get("/blog.hbs", (req, res) => {
    res.render("blog");
})
app.get("/about.hbs", (req, res) => {
    res.render("about");
})
app.get("/contact.hbs", (req, res) => {
    res.render("contact");
})
app.get("/admin.hbs",function (req, res) {
    Order.find(function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {

            cart = new Cart(order.cart);
            order.items = cart.generateArray();

        });
        res.render('admin', { orders: orders });
    });
});



    app.get("/newarrival.hbs", (req, res) => {
        res.render("newarrival", { csrfToken: req.csrfToken() });
    })
    app.get("/allproducts.hbs", (req, res) => {
        res.render("allproducts");
    })


    // create new user in our database
    // app.post("/register", async (req, res) => {
    //     try {
    //         const password = req.body.password;
    //         const cpassword = req.body.cpassword;

    //         if (password === cpassword) {
    //             const registerUser = new register({
    //                 firstname: req.body.firstname,
    //                 lastname: req.body.lastname,
    //                 email: req.body.email,
    //                 phone: req.body.phone,
    //                 password: password,
    //                 cpassword: cpassword
    //             });
    //             const saveUser = registerUser.save();
    //             res.status(201).render("index");
    //         } else {
    //             res.send("password is not match");
    //         }

    //     } catch (error) {
    //         res.send(error);
    //     }
    // });

    app.post('/register', passport.authenticate('local.signup', {
        // successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }), function (req, res, next) {
        console.log(req.session.oldUrl, 'signup');
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);

        } else {
            res.redirect('/profile');
        }
    });


    app.post('/login', passport.authenticate('local.signin', {
        // successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), function (req, res, next) {

        if (req.session.oldUrl) {

            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        } else {
            res.redirect('/profile');
        };
    });

    app.get('/profile', isLoggedIn, function (req, res) {
        Order.find({ user: req.user }, function (err, orders) {
            if (err) {
                return res.write('Error!');
            }
            var cart;
            orders.forEach(function (order) {

                cart = new Cart(order.cart);
                order.items = cart.generateArray();

            });
            res.render('profile', { orders: orders });
        });

    });


    app.post("/newarrival.hbs", (req, res) => {
        if (req.body._id == '')
            insertRecord(req, res);
        else
            updateRecord(req, res);
        // try {
        //     const newProduct = new product({
        //         proCompany: req.body.productb,
        //         proTitle: req.body.productn,
        //         proPrice: req.body.productp,
        //         proGender: req.body.products,
        //         proDes: req.body.productd,
        //     });


        //     const saveUser = newProduct.save((err, doc) => {
        //         if (!err){

        //             res.redirect("/allproducts");

        //         }
        //         else {

        //         res.render("newarrival.hbs", {
        //             newProduct: req.body
        //         });
        //     }
        //     });
        //      res.status(201).redirect("/allproducts");   
        //    } catch (error) {
        //     res.send(error);
    });

    function insertRecord(req, res) {
        var newproduct = new product();
        newproduct.proCompany = req.body.proCompany;
        newproduct.proTitle = req.body.proTitle;
        newproduct.proPrice = req.body.proPrice;
        newproduct.proGender = req.body.proGender;
        newproduct.proDes = req.body.proDes;
        newproduct.proImg= imagess();
        newproduct.save((err, doc) => {
            if (!err) {
                res.redirect("/allproducts");
            }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("newarrival.hbs",{view: "Insert New Products",newproduct: req.body})
                }
            };
        });

    };
    function imagess() {
        var images = [],
            index = 0;
        images[0] = "https://i.ibb.co/jG8rjgf/p14.jpg"
        images[1] = "https://i.ibb.co/Dgthpq2/p1.jpg"
        images[2] = "https://i.ibb.co/7Jbcywh/10.jpg"
        images[3] = "https://i.ibb.co/nMkg6kF/p13.jpg"
        images[4] = "https://i.ibb.co/rbJQCGs/p12.jpg"
        images[5] = "https://i.ibb.co/StJhZRG/p11.jpg"
        images[6] = "https://i.ibb.co/H4gXTZh/p9.jpg"
        images[7] = "https://i.ibb.co/fxY0j1r/p7.png"
        images[8] = "https://i.ibb.co/cQYbHVy/p8.jpg"
        images[9] = "https://i.ibb.co/fNKKbBv/p6.jpg"
        images[10] = "https://i.ibb.co/8cxm8Vg/p5.jpg"
        images[11] = "https://i.ibb.co/Lrd0dmD/p4.jpg"
        images[12] = "https://i.ibb.co/2YvxKBg/p3.jpg"
        index = "https://i.ibb.co/F4rrcvR/p2.jpg"
        
        index = Math.floor(Math.random() * images.length);
        return images[index];
    }

    function handleValidationError(err, body) {
        for (field in err.errors) {
            switch (err.errors[field].path) {
                case 'proCompany':
                    body['proCompanyError'] = err.errors[field].message;
                    break;
                case 'proTitle':
                    body['proTitleError'] = err.errors[field].message;
                    break;
                case 'proPrice':
                    body['proPriceError'] = "Price must be a number";
                    break;
                case 'proGender':
                    body['proGenderError'] = err.errors[field].message;
                    break;
                case 'proDes':
                    body['proDesError'] = err.errors[field].message;
                    break;
            }
        }
    };

    function updateRecord(req, res) {

        product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
            if (!err) {
                res.redirect('/allproducts');
            }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("newarrival", {
                        viewTitle: "Update Products",
                        newproduct: req.body
                    });
                }
                else
                    console.log('Error during record update : ' + err);
            }
        });
    };




    app.get("/allproducts", (req, res) => {
        product.find({}, (err, docs) => {
            if (!err) {
                res.render("allproducts", { list: docs });

            }
            else {
                console.log("Error in retrieving employee List: " + err);
            }
        })
    })
    app.get('/add-to-cart/:id', function (req, res, next) {

        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        product.findById(productId, function (err, product) {

            if (err) {
                console.log(err);
                return res.redirect('/index.hbs');
            }
            cart.add(product, product.id);
            // console.log(cart);  
            req.session.cart = cart;
            // console.log(req.session.cart);
            res.redirect('/shop.hbs');
        });
    });

    app.get('/reduce/:id', function (req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/shopping-cart.hbs');
    });
    app.get('/remove/:id', function (req, res, next) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/shopping-cart.hbs');
    });


    app.get('/logout', isLoggedIn, (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/index.hbs'); //Inside a callback… bulletproof!
        });
    })



    // DELETING THE PRODUCT
    app.use("/delete/:id", (req, res) => {
        product.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                res.redirect('/allproducts');
            }
            else {
                console.log("Error in deleteing product :" + err);
            }
        });
    });


    // login check
    // app.post("/login.hbs", async (req, res) => {
    //     try {
    //         const email = req.body.email;
    //         const password = req.body.password;

    //         const useremail = await register.findOne({ email: email });

    //         if (useremail.password === password) {
    //             res.status(201).render("index");
    //         } else {
    //             res.send("Invalid Login Details");
    //         }


    //     } catch (error) {
    //         res.status(400).send("Invalid Login Details");
    //     }   
    // })



    // UPDATE PRODUCTS

    // app.get("/:id", (req, res) => {
    //     product.findById(req.params.id, (err, doc) => {

    //         if (!err) {

    //             res.render("newarrival", {
    //                 newproduct: doc
    //             });
    //         }else{
    //             console.log("Error in ieving employee List: " + err);
    //         }
    //     });
    // });
    app.get('/shopping-cart.hbs', function (req, res, next) {
        if (!req.session.cart) {
            return res.render('shopping-cart.hbs', { products: null });
        }
        var cart = new Cart(req.session.cart);
        // console.log(cart.generateArray());
        res.render('shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });

    });


    app.get('/checkout.hbs', isLoggedIn, function (req, res, next) {

        if (!req.session.cart) {
            return res.render('/shopping-cart.hbs', { csrfToken: req.csrfToken() });
        }
        var cart = new Cart(req.session.cart);
        res.render('checkout', { total: cart.totalPrice, csrfToken: req.csrfToken() });
    });

    app.post("/checkout.hbs", isLoggedIn, function (req, res,) {
        if (!req.session.cart) {
            return res.redirect('/shopping-cart.hbs');

        }
        var cart = new Cart(req.session.cart);
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
        });
        order.save(function (err, result) {
            req.session.cart = null;
            res.redirect('/index.hbs');
        });


    });

    // app.get("/:id", (req, res) => {
    //     product.findById(req.params.id, (err, docs) => {
    //         if (!err) {
    //             res.render("newarrival", { productId: docs });
    //         }
    //         else {
    //             console.log("Error in retrieving employee List: " + err);
    //         }
    //     })
    // })

    app.get("/update/:id", (req, res) => {
        product.findById(req.params.id, (err, doc) => {

            if (!err) {

                res.render("newarrival.hbs", {
                    csrfToken: req.csrfToken(),
                    newproduct: doc
                });
            } else {
                console.log("Error in ieving employee List: " + err);
            }
        });
    });

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });



    // FORCE LOGIN USER
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.session.oldUrl = req.url;
        res.redirect('/login');
        console.log(req.session.oldUrl)

    };

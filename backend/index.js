require('dotenv').config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
});

// Base URL for production
const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

// Image storage engine
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'upload/images'),
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Creating upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `${baseUrl}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating API for deleting products
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        let updatedProducts = products.map(product => ({
            ...product.toObject(),
            image: product.image.replace('http://localhost:4000', baseUrl)
        }));
        res.send(updatedProducts);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Schema creation for user model
const Users = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Creating endpoint for registering user
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
        }
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = { user: { id: user.id } };
                const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, error: "Wrong password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong Email Id" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        res.send(newcollection);
    } catch (error) {
        console.error('Error fetching new collections:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating endpoint for popular in women
app.get('/popularinwomen', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular_in_women = products.slice(0, 4);
        res.send(popular_in_women);
    } catch (error) {
        console.error('Error fetching popular in women:', error);
        res.status(500).json({ success: false, errors: "Server error" });
    }
});

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Creating endpoint for adding products in cart data
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0;
        }
        userData.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added");
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Server error');
    }
});

// Creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send('Server error');
    }
});

// Creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});


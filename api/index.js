const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const User = require ('./models/User');
const Note = require ('./models/Note');
const Products = require ('./models/Products');
const Contact = require ('./models/Contact');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const cookieParser = require ('cookie-parser');
const multer = require ('multer');
const path = require ('path');
const fs = require ('fs');
const sesion = require ('express-session');
const ws = require ('ws');
const app = express ();
require ('dotenv').config ();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030', 'https://fixxer-api.vercel.app', 'https://fixxer-app.vercel.app'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
};

app.use (cors (corsOptions));
app.use (express.json ());
app.use (cookieParser ());

app.use (sesion ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

mongoose.connect (process.env.MONGODB_URL);

//? Register & Login
app.post ('/register', async (req, res) => {
    const {username, password, email} = req.body;
    try {
        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
            tags: ['user'],
        })
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post ('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if (!userDoc) {
        return res.redirect('/login');
    }
    const  passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username, profilePhoto:userDoc.profilePhoto , email:userDoc.email, tags:userDoc.tags, id:userDoc._id}, secret, {} , (err, token) => {
            if (err) {
                console.error('Token oluşturulamadı:', err);
                return res.status(500).json({ error: 'Token oluşturulamadı' });
            }

            res.cookie('token', token,{sameSite: "none", maxAge: 24 * 60 * 60 * 1000, httpOnly: false, secure: true}).json({
                id:userDoc._id,
                username,
                email:userDoc.email,
                tags:userDoc.tags,
                profilePhoto: userDoc.profilePhoto,
            });
            console.log('Logged in, Token olusturuldu.', token);
        });
    }else{
        res.status(400).json({message: 'Wrong password'});
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json({message: 'Logged out'});
});


//? Profile
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.get('/profile/:username', async (req, res) => {
    const {username} = req.params;
    const userDoc = await User.findOne ({username});
    res.json(userDoc);
});

//? Note Post & Get
app.post ('/note', async (req, res) => {
    try {
        const {title, content, tags} = req.body;
        const noteDoc = await Note.create({
            title,
            content,
            tags,
        });
        res.json(noteDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get ('/note', async (req, res) => {
    try {
        const noteDoc = await Note.find();
        res.json(noteDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete ('/deleteallNotes', async (req, res) => {
    try {
        const noteDoc = await Note.deleteMany();
        res.json(noteDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.put('/note/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { tags } = req.body;
      const updatedNote = await Note.findByIdAndUpdate(id, { tags }, { new: true });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

app.post ('/note/:id/upvote', async (req, res) => {
    try {
        const {id} = req.params;
        const noteDoc = await Note.findById(id);
        noteDoc.upvotes++;
        await noteDoc.save();
        res.json(noteDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete ('/note/:id/upvote', async (req, res) => {
    try {
        const {id} = req.params;
        const noteDoc = await Note.findById(id);
        noteDoc.upvotes--;
        await noteDoc.save();
        res.json(noteDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});


//? Product Post & Get
app.post ('/product', async (req, res) => {
    try {
        const {name, price, kar, karOran, vergi, total} = req.body;
        const productDoc = await Products.create({
            name,
            price,
            kar,
            karOran,
            vergi,
            total,
        });
        res.json(productDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get ('/product', async (req, res) => {
    try {
        const productDoc = await Products.find();
        res.json(productDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete ('/deleteallProducts', async (req, res) => {
    try {
        const productDoc = await Products.deleteMany();
        res.json(productDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

//? CONTACT PAGE
app.post ('/contact', async (req, res) => {
    const {name, email, message} = req.body;
    try {
        const contactDoc = await Contact.create({
            name,
            email,
            message,
        });
        res.json(contactDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get ('/contact', async (req, res) => {
    try {
        const contactDoc = await Contact.find();
        res.json(contactDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.delete ('/contact/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const contactDoc = await Contact.findByIdAndDelete(id);
        res.json(contactDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});



//! Listen to port 3030
app.listen(3030, () => {
    console.log('Server listening on port 3030 || nodemon index.js')
});
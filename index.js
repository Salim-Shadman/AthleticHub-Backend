const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://athletic-e8d0b.web.app',
        'https://athletic-e8d0b.firebaseapp.com'
    ],
    credentials: true
}));


//middleware
app.use(express.json());

app.use(cookieParser());


const uri = process.env.DB_URI;
// console.log(uri);


const client = new MongoClient(uri, {


    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }

});


//jwt token verify er jonno middleware add korbo ekhn 

const verifyToken = (req, res, next) => {

    const token = req.cookies.token;


    if (!token) {

        return res.status(401).send({ message: 'Unauthorized access. Please login.' });
    }


    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {

        if (err) {

            return res.status(401).send({ message: 'Unauthorized access. Session is invalid.' });
        }


        req.user = decoded;
        next();

    });
};


async function run() {


    try {

        const db = client.db('AthleticHubDB');
        const eventsCollection = db.collection('events');
        const bookingsCollection = db.collection('bookings');


        // jwt generate kortechi jokhn user login kore
        app.post('/jwt', (req, res) => {

            const user = req.body;
            console.log('User requesting token:', user);

            //token generate korlam
            const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });


            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            }).send({ success: true });

        });


        //user logout hoile jwt token clear hobe

   



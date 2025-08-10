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
 app.post('/logout', (req, res) => {


            res.clearCookie('token', {
                maxAge: 0,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            }).send({ success: true });


        });

   
 //sob event er route ekhane dibo
        app.get('/events', async (req, res) => {

            try {

                let query = {};

                if (req.query.creatorEmail) {

                    query = { creatorEmail: req.query.creatorEmail };

                }


                const events = await eventsCollection.find(query).sort({ date: -1 }).toArray();
                res.send(events);

            } catch (err) {

                res.status(500).send({ message: 'Server error: Failed to fetch events' });
            }

        });


   //get a single event 
        app.get('/events/:id', async (req, res) => {

            try {

                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const event = await eventsCollection.findOne(query);

                res.send(event || {});

            } catch (err) {

                res.status(500).send({ message: 'Server error: Failed to fetch event details.' });

            }
        });




        //new event create korar route
        app.post('/events', verifyToken, async (req, res) => {

            try {
                const eventData = req.body;

                //logged in user e event create korche kina check korlam
                if (req.user.email !== eventData.creatorEmail) {

                    return res.status(403).send({ message: 'Forbidden action. You cannot create an event for another user.' });
                }

                const result = await eventsCollection.insertOne(eventData);
                res.send(result);


            } catch (err) {

                res.status(500).send({ message: 'Server error: Failed to create the event.' });

            }
        });

         //event er data update route
        app.put('/events/:id', verifyToken, async (req, res) => {

            try {

                const id = req.params.id;
                const updatedEventData = req.body;


                if (req.user.email !== updatedEventData.creatorEmail) {
                    return res.status(403).send({ message: 'Forbidden action. You are not the owner of this event.' });
                }


                const filter = { _id: new ObjectId(id) };


                const updateDoc = {

                    $set: {

                        eventName: updatedEventData.eventName,
                        eventType: updatedEventData.eventType,
                        date: updatedEventData.date,
                        description: updatedEventData.description,
                        image: updatedEventData.image,
                        location: updatedEventData.location,


                    },
                };

                const result = await eventsCollection.updateOne(filter, updateDoc);
                res.send(result);

            } catch (err) {

                res.status(500).send({ message: 'Server error: Failed to update the event.' });
            }
        });


        //event delete korar route..
        app.delete('/events/:id', verifyToken, async (req, res) => {

            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };

                //delete korar age ownership verify korlam
                const event = await eventsCollection.findOne(query);
                if (!event) {
                    return res.status(404).send({ message: 'Event not found.' });
                }


                if (req.user.email !== event.creatorEmail) {

                    return res.status(403).send({ message: 'Forbidden action. You do not have permission to delete this event.' });
                }

                const result = await eventsCollection.deleteOne(query);

                res.send(result);



            } catch (err) {
                res.status(500).send({ message: 'Server error: Failed to delete the event.' });
            }

        });



        //get bookings er route
        app.get('/bookings', verifyToken, async (req, res) => {


            try {


                if (req.user.email !== req.query.email) {


                    return res.status(403).send({ message: 'Forbidden. You can only view your own bookings.' });

                }

                const bookings = await bookingsCollection.find({ user_email: req.query.email }).toArray();
                res.send(bookings);



            } catch (err) {

                // console.error(err);
                res.status(500).send({ message: 'Server error: Failed to fetch bookings.' });

            }
        });
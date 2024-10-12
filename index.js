const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const dotenv=require('dotenv');

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;



// MongoDB connection URL and database name

const uri = process.env.URI;

const dbName = 'blood-lagbe'; // Replace with your database name

let db;

// Connecting to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

// Route to search for donors
app.get('/donors', async (req, res) => {
    try {
        const { area, bloodGroup } = req.query;

        // Build the search query
        const query = {};
        console.log(area, bloodGroup);


        if (area) query.area = new RegExp(area, 'i');
        // if (name) query.name = new RegExp(name, 'i'); // Case-insensitive regex search for name
        if (bloodGroup) query.bloodGroup = bloodGroup;

        // Access the 'donor' collection and search with the query
        const donors = await db.collection('donors').find(query).toArray();

        res.send(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/beadonor', async (req, res) => {
    const user = (req.body);
    console.log(user);
    res.send(user);
    try {

        const query = {
            mobile: user.mobile
        };

        const checkUser = await db.collection('donors').find(query).toArray();
        if (checkUser.length) {
            console.log('user exists');
            
        } else {

            // Select the database and collection
            const donors = db.collection('donors');

            // Insert the document into the collection
            const result = await donors.insertOne(user);

            console.log(`New user inserted with ID: ${result.insertedId}`);
        }
    } catch (error) {
        console.error('Error inserting user document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

app.get('/', (req, res) => {
    res.send("hello user");
})



// app.get('/donors',(req,res)=>{
//     const name=req.body.name;
//     const area=req.body.area;
//     const bloodGroup=req.body.bloodGroup;
//     res.send(searchUsersByArea(name,area,bloodGroup));
// })

app.listen(port, () => {
    console.log("app started");
})


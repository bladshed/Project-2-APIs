// import in the packages
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// require in the library for cross origin resources sharing
const cors = require('cors');

// import in the MongoUtil object from MongoUtil.js
const MongoUtil = require('./MongoUtil');
const { ObjectId } = require('bson');

let app = express();
app.use(express.json()); // allows clients (such as browsers) to send JSON requests to our Express server

// enable cors so that javascript ran from other domain can access the endpoint
app.use(cors());

async function main() {

    // we want to connect to the database
    await MongoUtil.connect(process.env.MONGO_URI, "project_2");

    // ROUTES
    app.get('/', function(req,res){
        res.json({
            "message":"Welcome to my Project 2 APIs"
        })
    })

    // get all outfit records
    app.get('/outfits', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        try {
            let results = await db.collection('outfits').find({},{
                'projection': {
                    'submittedBy': 1,
                    'type': 1,
                    'gender': 1,
                    'description' : 1
                }
            }).toArray();

            console.log(results);
            res.json(results);
        }
        catch(e) {
            res.status(500);
            res.json({
                'error':"Unable to fetch records"
            })
        }        
    })

    // add outfit record
    app.post('/outfits', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        // initialize variables
        let submittedBy = req.body.submittedBy;
        let type = req.body.type;
        let gender = req.body.gender;
        let img_url = req.body.img_url;
        let description = req.body.description;
        let dateCreated = new Date();

        // if any lines in the try block causes an error, immediately go to the catch part
        try {
            let result = await db.collection('outfits').insertOne({
                'submittedBy': submittedBy,
                'type': type,
                'gender': gender,
                'img_url': img_url,
                'description' : description,
                'dateCreated': dateCreated
            })
            res.json(result);
        }
        catch (e) {
            // if there is an error while trying to add to the database,
            // we will inform the client
            res.status(500); // tell the client we had an internal server error
            res.json({
                'message': "Failed to add record",
                'error': e.message
            })
        }
    })

    // modify outfit record
    app.put('/outfits/:id', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();
        
        try {
            await db.collection('outfits').updateOne({
                '_id':ObjectId(req.params.id)
            }, {
                '$set': {
                    'submittedBy': req.body.submittedBy,
                    'type': req.body.type,
                    'gender': req.body.gender,
                    'img_url': req.body.img_url,
                    'description' : req.body.description,
                    'dateModified': new Date()
                }
            })
            res.json({
                'message':"success"
            })
        } catch(e) {
            res.status(500);
            res.json({
                'message':"Unable to update document",
                'error': e.message
            })
        }
    })

    // we are using PUT instead of POST because we are updating an existing document by providing a replacement document
    app.put('/food_sighting/:id', async function(req,res){
        try {
            await db.collection('sightings').updateOne({
                '_id':ObjectId(req.params.id)
            }, {
                'description': req.body.description, // for post, put and patch, the data sent to the endpoint is in req.body
                'foods': req.body.foods,
                'date': new Date(req.body.date) || new Date()
            })
            res.json({
                'message':"success"
            })
        } catch(e) {
            res.status(500);
            res.json({
                'message':"Unable to update document"
            })
        }
    })

    // for endpoints that delete documents, we use app.delete
    app.delete('/food_sighting/:id', async function(req,res){
        const db = MongoUtil.getDB();
        await db.collection('sightings').remove({
            '_id':ObjectId(req.params.id)
        })
        res.json({
            'message':"Record has been deleted"
        })
    })
}
// run the main function immediately after we define it
main();


// START SERVER
app.listen(3000, function(req,res){
    console.log("Server started")
})
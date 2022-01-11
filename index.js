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

// get outfit record via reviewId
async function getOutfitByReviewId(db, reviewId) {
    // get outfit record via review id
    let record = await db.collection('outfits').findOne({
        'reviews._id': ObjectId(reviewId)
    });

    return record;
}

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
                    'img_url': 1,
                    'description' : 1,
                    'dateCreated': 1,
                    'dateModified': 1
                }
            }).toArray();

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

    // get outfit record by id
    app.get('/outfits/:id', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();
        let result = await db.collection('outfits').findOne({
            '_id':ObjectId(req.params.id)
        });
        res.json({
            'outfit': result
        })  
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

    // delete outfit data
    // for endpoints that delete documents, we use app.delete
    app.delete('/outfits/:id', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        await db.collection('outfits').remove({
            '_id':ObjectId(req.params.id)
        })
        res.json({
            'message':"Record has been deleted"
        })
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////  REVIEWS APIs  //////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // get review record attached to an existing outfit document
    app.get('/reviews/:reviewId', async function(req,res){

        // to select or to retrieve a sub-document
        // step 1. select the main document that the sub-document belongs to

        // get instance of Mongo db
        const db = MongoUtil.getDB();

        try {
            // 1st code
            // let results = await db.collection('outfits').findOne({
            //     'reviews._id': ObjectId(req.params.reviewId)
            // }, 
            // // second argument to the findOne function allows us to provide an object with options
            // {
            //     'projection': { 
            //         // projection is to select which keys of the document to show
            //         'reviews': {
            //             '$elemMatch':{
            //                 '_id': ObjectId(req.params.reviewId) // only show the element from the notes array where its _id matches
            //                                                 // the provided noteid
            //             }
            //         }
            //     }
            // });

            // 2nd code
            let result = await getOutfitByReviewId(db, req.params.reviewId);

            res.json({
                'review': result.reviews[0]
            })
        } catch(e) {
            res.status(500);
            res.json({
                'message':"Unable to update document",
                'error': e.message
            })
        }
    })

    // add new review record
    app.post('/outfits/:id/reviews/add', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        // create new review object
        let newReview = {
            '_id': ObjectId(), // create a new ObjectId
            'submittedBy': req.body.submittedBy,
            'rating': req.body.rating,
            'comment': req.body.comment,
            'dateCreated': new Date()
        }

        try {
            await db.collection('outfits').updateOne({
                '_id': ObjectId(req.params.id),
            },{
                '$push': {
                    'reviews': newReview
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

    // edit a review attached to an existing outfit document
    app.put('/reviews/:reviewId', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        // get outfit record via review id
        let record = await getOutfitByReviewId(db, req.params.reviewId);

        // check if outfit record exists
        if(record){
            await db.collection('outfits').updateOne({
                'reviews._id': ObjectId(req.params.reviewId)
            },{
                '$set': {
                    'reviews.$.rating': req.body.rating,    // $ refers to the index of the element
                    'reviews.$.comment': req.body.comment,  // where its _id matches req.params.noteid
                    'reviews.$.dateModified': new Date()
                }
            })

            res.json({
                'message':"success"
            })
        } else {
            res.status(500);
            res.json({
                'message':"Unable to update document",
                'error': e.message
            })
        }
    })

    // delete a review attached to an existing outfit document
    app.delete('/reviews/:reviewId', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        // get outfit record via review id
        let record = await getOutfitByReviewId(db, req.params.reviewId);

        // check if outfit record exists
        if(record){
            try {
                await db.collection('outfits').updateOne({
                    '_id': ObjectId(record._id)
                },{
                    '$pull':{
                        'reviews': {
                            '_id': ObjectId(req.params.reviewId)
                        }
                    }
                })
                res.json({
                    'message':"Review record has been deleted"
                })
            } catch(e) {
                res.status(500);
                res.json({
                    'message':"Unable to update document",
                    'error': e.message
                })
            }
        } else {
            res.status(500);
            res.json({
                'message':"Review record doesnt exist"
            })
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////  SEARCH APIs  //////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // allows users to search for outfit records
    app.get('/outfit-search', async function(req,res){
        // get instance of Mongo db
        const db = MongoUtil.getDB();

        // example query
        // db.collection('sightings').find({
        //     'description': {$regex: "LT2A", $options:'i'},
        //     'food': {
        //         '$in': ["fried rice"]
        //     }
        // })

        // another example query
        // {'$and': [{type: {'$in':['casual', 'streetwear']}, gender: {'$in':['male']}}]}

        // initialize query variable
        let criteria = {"$and" : []};

        // set description query
        if (req.query.description) {
            criteria.$and.push({
                description: {
                    $regex: req.query.description,
                    $options:'i'
                }
            })
        }

        // set type query
        if (req.query.types) {
            let typesArray = [];
            if (!Array.isArray(req.query.types)) {
                typesArray.push(req.query.types)
            } else {
                typesArray = req.query.types;
            }

            criteria.$and.push({
                type: {"$in": typesArray}
            })
        }

        // set gender query
        if (req.query.genders) {
            let gendersArray = [];
            if (!Array.isArray(req.query.genders)) {
                gendersArray.push(req.query.genders)
            } else {
                gendersArray = req.query.genders;
            }

            criteria.$and.push( {
                gender: {"$in": gendersArray}
            });
        }

        // if the user didn't specify any search criteria, the search will return all documents
        // empty criteria if query is empty
        if(criteria.$and.length == 0){
            criteria = {};
        }

        try {
            // console.log("criteria: " + JSON.stringify(criteria));
            // get query results
            let results = await db.collection('outfits').find(criteria).toArray();
            // console.log('results: ' + JSON.stringify(results));
            res.json(results);
        }
        catch(e) {
            res.status(500);
            res.json({
                'error':"Unable to fetch records"
            })
        }
    });
}
// run the main function immediately after we define it
main();

// START SERVER
app.listen(7070, function(req,res){
    console.log("Server started")
})
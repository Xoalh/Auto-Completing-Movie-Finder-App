//Require dependencies
const express = require('express')
const app = express() 
const cors = require('cors')
const { response } = require('express')
const { ObjectId } = require('bson')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

//Variables
let db, 
    dbConnectionString = process.env.DB_STRING, //get the string from the env file. Should be a const for best practice
    dbName = "sample_mflix",  
    collection 

//Connect to MongoDb
MongoClient.connect(dbConnectionString)

//promise language rather than async. Should look up async version
    .then(client => {
        console.log("Connected to Database")
        db = client.db(dbName)
        collection = db.collection('movies')
    })     

    //Middleware
    app.set('view engine', 'ejs')   //Set view engine to ejs
    app.use(express.static('public'))  //setting up a folder to hold main.js and style etc. External files
    app.use(express.urlencoded({extended:true})) //parses urls
    app.use(express.json())                      //parse JSON
    app.use(cors())    //cross origin requests

    //Tell server to respond
    app.get('/search', async (req,res) =>{
        try{
            let res = await collection.aggregate([{
                "$Search" :{
                    "autocomplete":{
                        "query" :`${request.query.query}`,
                        "path" : "title",
                        "fuzzy":{
                            "maxEdits":2,
                            "prefixLength": 3,                            
                        }
                    }
                }
            }]).toArray()
            response.send(result)
           
        }catch(error){
           response.status(500).send({message: error.message})
        }
    })

    //Now that the search get happened, need the specific movie shown in the list. 
    app.get('/get/:id', async (req, res) => {
        try{
            let result = await collection.findOne({
                "_id": ObjectId(req.params.id)
            })
            res.send(result)
        }catch(error){
            response.status(500).send({message: error.message})
        }
    })


    //PORT Creation
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running. Go catch it`)
  })  
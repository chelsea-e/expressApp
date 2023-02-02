const express = require("express")
const cors = require("cors")

const path = require("path")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())

app.use(express.json());
app.use(bodyParser.json()) //parse application/json
app.use(express.urlencoded({ extended: true }))

//1st step of setting up mongo db connection
let propertiesReader = require('properties-reader');
//retrieving properties from db.properties
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PassWorD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;


const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://WebIndividual2:WebIndividual2@webindividual2.ugowvfs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
const ObjectId = require('mongodb').ObjectId;

/*client.connect(err => {
  const collection = client.db("Webstore").collection("lessons");
  // perform actions on the collection object
  client.close();
}); */
let db = client.db(dbName);

app.set("json spaces", 3);

// Logger Middleware
app.use(function (req, res, next) {
    console.log("Received request for URL:" + req.url);
    next();
});

// Static Middleware
app.use('/images', express.static(path.join(__dirname, 'images')))

// Error Message
app.use(function (req, res, next) {
    if (req.path.startsWith('/images')) {
        res.status(404).send("Image not found")
    }
    next();
});

app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
})


app.get("/collections/:collectionName", (req, res, next) => {
    req.collection.find({}).toArray(function (err, results) {
        if (err) {
            return next(err)
        } else {
            res.send(results)
        }
    })
})

app.post('/collections/:collectionName', function (req, res, next) {

    req.collection.insertOne(req.body, function (err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    })
});

app.put('/collections/:collectionName/:id', function (req, res, next) {
    var id = req.params.id;
    console.log(id)
    req.collection.updateOne({ _id: ObjectId(id) }, { $set: req.body }, function (err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});



app.listen(3000, () => {
    console.log("Server is running!")
});
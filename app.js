const express = require("express")
const cors = require("cors")

const path = require("path")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())

app.use(express.json());
app.use(bodyParser.json()) //parse application/json
app.use(express.urlencoded({extended:true}))

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
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;


const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://WebIndividual2:WebIndividual2@webindividual2.ugowvfs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

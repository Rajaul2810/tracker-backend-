require('dotenv').config()
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
// const { ObjectId } = require('mongodb');
const port = 8008

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!')
})





const uri = "mongodb+srv://user:1234@cluster0.wumse.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    
    const collection = client.db("tracker").collection("user");
    const reportCollection = client.db("tracker").collection("report");
    const projectCollection = client.db("tracker").collection("project");


    app.post('/register', (req, res) => {
        const User = req.body;
        //res.send('Hello World!')
        console.log(User)
        collection.findOne({ email: User.email }, (err, user) => {
            if (user) {
                console.log(user)
                res.send({ message: "User Already Registered" })
            } else {
                collection.insertOne(User)

                    .then(result => {
                        console.log(result);
                        res.send({ message: 'Successfully Registered' })
                    })
            }
        })
    })
    app.post('/login', (req, res) => {
        const { email, password } = req.body
        collection.findOne({ email: email }, (err, user) => {
            if (user) {
                if (password === user.password) {
                    res.send({ message: 'Successfully Login', user })
                } else {
                    res.send({ message: 'Password Not Match' })
                }
            } else {
                res.send({ message: 'User Not Registered' })
            }
        })
    })




    // add report

    app.post('/addReport', (req, res) => {
        const events = req.body
        reportCollection.insertOne(events)
            .then(result => {
                console.log(result);
                res.send({ message: 'Successfully add Report' })

            })
    })

    // add project

    app.post('/addProject', (req, res) => {
        const events = req.body
        projectCollection.insertOne(events)
            .then(result => {
                console.log(result);
                res.send({ message: 'Successfully add Project' })

            })
    })




    //get report
    app.get("/getReport", (req, res) => {
        reportCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // get project 

    app.get("/getProject", (req, res) => {
        projectCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

  

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
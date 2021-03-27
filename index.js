const express = require('express');

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const password = 'jalal2009';


const uri = "mongodb+srv://jalal406:jalal2009@cluster0.owenr.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json())
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send('hello i am working');
    res.sendFile(__dirname + '/index.html');
})




client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    //   const product = {name: "modu", price: 25, quantity: 20};
    app.post("/addProduct", (req, res) => {
       const product = req.body;
    //    console.log(product);
       productCollection.insertOne(product)
       .then(result => {
           console.log("data added successfully");
           res.redirect('/');
       })
    })

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price);
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => {
            // console.log(result);
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            // console.log(result);
            res.send(result.deletedCount > 0)
        })
    })

    app.get('/product/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        })
        
    })

    // app.post("/addProduct", (req, res) => {
    //     collection.insertOne(product)
    //         .then(result => {
    //             console.log('one product added');
    //         })


    console.log("Database Connected");

});


app.listen(3000)
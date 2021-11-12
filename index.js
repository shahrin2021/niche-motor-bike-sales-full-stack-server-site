const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;
const app= express();
const cors = require('cors')
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// nicshBikeSales dXBwC4p3laRYYbOk


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hes3p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run(){
    try{
        await client.connect();
        console.log('database connect')
        const database = client.db('bikeSalesService');
        const productsCollection= database.collection('bikeProducts');
        const orderCollection= database.collection('orders');

        // get product
        app.get('/products' , async(req, res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products)

        });
// get single product
        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product= await productsCollection.findOne(query);
            res.json(product)
        });

        // post orders

        app.post('/orders', async(req, res)=>{
            const cursor = req.body;
            const order = await orderCollection.insertOne(cursor);
            res.json(order)
        });

        app.get('/orders/:email',async (req, res)=>{
            const cursor = orderCollection.find({email:req.params.email});
            const product = await cursor.toArray()
            res.json(product)
        });
// all order get
        app.get('/orders' , async(req, res)=>{
            const cursor = orderCollection.find({});
            const products = await cursor.toArray();
            res.json(products)

        });

    }finally{
        // await client.close()
    }
}

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('bike sales')
})

app.listen(port , ()=>{
    console.log('listen port ', port)
})
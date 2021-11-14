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
        const usersCollection= database.collection('users');
        const reviewCollection= database.collection('reviews');

        // get product
        app.get('/products' , async(req, res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products)

        });
// get single product
        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id: ObjectId(id)};
            const product= await productsCollection.findOne(query);
            res.json(product)
        });

        app.post('/products', async(req, res)=>{
            const cursor = req.body;
            const order = await productsCollection.insertOne(cursor);
            res.json(order)
        });

        app.put('/products/:id',async(req, res)=>{
            const id = req.params.id;
            const updateProduct= req.body;
            const query = {_id:ObjectId(id)};
            const options={ upsert: true };
            const updateDoc ={
                $set:{
                    name:updateProduct.name,
                    price:updateProduct.price,
                    img:updateProduct.img,
                    stock:updateProduct.stock
                }
            }
            const result = await productsCollection.updateOne(query, updateDoc, options );
                  res.json(result)

        })

       

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

        // get by id

        app.get('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query= {_id :ObjectId(id) }
            const product = await orderCollection.findOne(query);
            res.json(product)
        })

        // delete 

        app.delete('/orders/:id',async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        });


         // get user
         app.get('/users/:email', async(req, res)=>{
            const email= req.params.email;
            const query= {email: email};
            const user = await usersCollection.findOne(query)
            let isAdmin =false;
            if(user?.role === 'admin'){
                isAdmin=true;
            }
            console.log(isAdmin)
            res.json({admin:isAdmin})
        });

        // post user
        app.post('/users', async(req, res)=>{
            const user= req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)

        })

        app.put('/users', async(req, res)=>{
            const user= req.body;
            const filter = {email: user.email};
            const option = {upsert:true}
            const updateDoc={
                $set:user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            res.json(result)
        })

       

      

        
        app.put('/users/admin', async(req, res)=>{
            const user= req.body;
            console.log(user)
            const filter = {email: user.email};
            const option = {upsert:true}
            const updateDoc={
                $set:{role: 'admin'}
            }
            const result = await usersCollection.updateOne(filter, updateDoc,option);
            console.log(result)
            res.json(result)
        });

        // review post 


        app.post('/reviews', async(req, res)=>{
            const cursor = req.body;
            const review = await reviewCollection.insertOne(cursor);
            res.json(review)
        });
            // get reviews 
        app.get('/reviews', async(req,res)=>{
            const cursor = reviewCollection.find({});
            const products = await cursor.toArray();
            res.json(products)
        });


    }finally{
        // await client.close()
    }
}

// DB_USER=nicshBikeSales
// DB_PASS=dXBwC4p3laRYYbOk

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('bike sales')
})

app.listen(port , ()=>{
    console.log('listen port ', port)
})
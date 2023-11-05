const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(express.json())
app.use(cors())




app.get('/',(req,res)=>{
    res.send('Career Builder sever is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqbtto6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryCollection=client.db('careerBuilder').collection('jobCategorys')
    const jobCollection=client.db('careerBuilder').collection('jobs')

    app.get('/categories',async(req,res)=>{
        const cursor=categoryCollection.find()
        const result=await cursor.toArray()
        res.send(result)

    })

    app.post('/jobs',async(req,res)=>{
      const job=req.body
      console.log(job)
      const result=await jobCollection.insertOne(job)
      res.send(result)
    })

    app.get('/jobs', async (req, res) => {

      console.log(req.query.jobCategory)
      let query = {};
      if (req.query?.jobCategory) {
          query = {
              jobCategory: req.query.jobCategory
          }
      }
      const cursor = jobCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
  })

    app.get('/jobs', async (req, res) => {

      console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
          query = {
              jobCategory: req.query.email
          }
      }
      const cursor = jobCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
  })

  app.delete('/jobs/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id : new ObjectId (id)}
    const result =await jobCollection.deleteOne(query)
    res.send(result)
  })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.cl ose();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`server is running on PORT : ${port}`)
})
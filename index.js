const express = require('express');
const cors = require('cors');
// const jwt=require('jsonwebtoken')
// const cookieParser=require('cookie-parser')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(express.json())
// app.use(cors({
//   origin:['http://localhost:5173'],
//   credentials:true
// }))
app.use(cors())
// app.use(cookieParser())




app.get('/', (req, res) => {
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

// const verifyToken=(req,res,next)=>{
//   const token=req?.cookies?.token
//   console.log('token in middleware',token)
//   if (!token) {
//     return res.status(401).send({message:'unauthorized access'})
//   }
//   jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
//     if (err) {
//       return res.status(401).send({message:'unauthorized access'})
//     }
//     req.user=decoded
//     next()
//   })
//   next()
// }


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoryCollection = client.db('careerBuilder').collection('jobCategorys')
    const jobCollection = client.db('careerBuilder').collection('jobs')
    const appliedJobCollection = client.db('careerBuilder').collection('appliedJobs')


    // app.post('/jwt',async(req,res)=>{
    //     const user=req.body
    //     console.log('user token',user)
    //     const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})

    //     res.cookie('token',token,{
    //       httpOnly:true,
    //       secure:true,
    //       sameSite:'none'
    //     })
    //     .send({success:true})
    // })


    // app.post('/logout',async(req,res)=>{
    //   const user=req.body
    //   console.log('logging out',user)
    //   res.clearCookie('token',{ maxAge: 0 }).send({success:true})
      
    // })



    

    app.post('/jobs', async (req, res) => {
      const job = req.body
      console.log(job)
      const result = await jobCollection.insertOne(job)
      res.send(result)
    })


    app.get('/jobs', async (req, res) => {

      console.log(req.query.email)
      // if (res.user.email!==res.query.email) {
      //   return res.status(403).send({message:'forbidden access'})
      // }
      let query = {};
      if (req.query?.email) {
        query = { email:req.query.email}
      }
      const result = await jobCollection.find(query).toArray()
      res.send(result);
    })

    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/jobs/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result= await jobCollection.findOne(query)
      res.send(result)
    })

    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updatedJob = req.body
        const job = {
          $set: {
            jobTitle:updatedJob.jobTitle,
            userName:updatedJob.userName, 
            jobCategory:updatedJob.jobCategory, 
            salaryRange:updatedJob.salaryRange, 
            jobDescription:updatedJob.jobDescription, 
            jobPostingDate:updatedJob.jobPostingDate, 
            applicationDeadline:updatedJob.applicationDeadline, 
            jobApplicantsNumber:updatedJob.jobApplicantsNumber, 
            photo:updatedJob.photo
          }

        }

      const result = await jobCollection.updateOne(filter,job,options)
      res.send(result)
    })

    app.get('/jobs',async(req,res)=>{
      const cursor=jobCollection.find()
      const result=await cursor.toArray()
      res.send(result)
      
    })



     app.post('/appliedJobs', async (req, res) => {
      const job = req.body
      console.log(job)
      const result = await appliedJobCollection.insertOne(job)
      res.send(result)
    })


    // app.get('/appliedJobs',async(req,res)=>{
    //   const cursor=appliedJobCollection.find()
    //   const result=await cursor.toArray()
    //   res.send(result)
    // })

    app.get('/appliedJobs', async (req, res) => {

      console.log(req.query.email)
      // if (res.user.email!==res.query.email) {
      //   return res.status(403).send({message:'forbidden access'})
      // }
      let query = {};
      if (req.query?.email) {
        query = {email:req.query.email}
      }
      const result = await appliedJobCollection.find(query).toArray()
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.cl ose();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`server is running on PORT : ${port}`)
})
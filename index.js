const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ow6y0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5trbi.mongodb.net/creativeAgency?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
// console.log(DB_USER);
const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5000

client.connect(err => {
  const Orders = client.db("creativeAgency").collection("Order");
  const Reviews = client.db("creativeAgency").collection("Review");
  const Admins = client.db("creativeAgency").collection("Admin");
  const Services = client.db("creativeAgency").collection("Service");
 //add order  
  app.post('/NewOrder' , (req , res) =>{
    const allOrder = req.body;
    Orders.insertOne(allOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
//show order list
    app.get('/review', (req, res) => {
      Orders.find({ email: req.query.email})
      .toArray((err , documents)=>{
          res.send(documents)
      })
  })

  //All customer order loaded in Admin ServiceList
  app.get("/getCustomerOrder", (req, res) =>{
    Orders.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  //review
  app.post('/addReview' , (req , res) =>{
    const allReview = req.body;
    Reviews.insertOne(allReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  //show review
  app.get('/reviews', (req, res) => {
      Reviews.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })

  //send MakeAdmin email to database
  app.post("/addEmail", (req, res)=>{
    const Email = req.body;
    Admins.insertOne(Email)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })


  // get Make Admin Email and send to Private Route
    app.get("/getEmail", (req, res) =>{
    Admins.find({email: req.query.email})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })
 

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    Admins.find({ email: email })
        .toArray((err, documents) => {
            res.send(documents.length > 0);
        })
})

  //add Services  
  app.post('/addService' , (req , res) =>{
    const allOrder = req.body;
    Services.insertOne(allOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  //get show services
  app.get("/getService", (req, res) =>{
    Services.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })


  app.delete('/delete/:id',(req,res)=>{
    Services.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
  app.delete('/deleteOrder/:id',(req,res)=>{
    Orders.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  // app.patch('/update/:id',(req,res)=>{
  //   Orders.updateOne({_id: ObjectId(req.params.id)},
  //   {
  //     $set : {status :req.body.status}
  // })
  //   .then(result=>{
  //   res.send(result.modifiedCount>0)
  //   })
  // })

  app.patch('/updateStatus/:id',(req, res) => {
    Orders.updateOne({_id: ObjectId(req.params.id)}, 
    {
        $set: {status: req.body.status}
    })
    .then(result => {
        res.send(result.modifiedCount > 0)
    })
}) 

  


});
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})
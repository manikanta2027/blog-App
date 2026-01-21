const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const userApp = require('./APIs/userApi');
const authorApp = require('./APIs/authorApi');
// const adminApp = require('./APIs/adminApi');
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 5000;
mongoose.connect(process.env.DBURL)
.then(()=>app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
    console.log("DB connected successfully");
}))
.catch((err)=>console.log("error in DB connection", err));


app.use(express.json());
//connect API routes

app.use('/user-api',userApp);
app.use('/author-api',authorApp);
// app.use('/admin-api',adminApp);

   


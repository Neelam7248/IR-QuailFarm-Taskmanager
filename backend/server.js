if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express=require('express');
const app=express();
const cors=require('cors');
//const Client=require('../models/Client');
const mongoose=require('mongoose');

//const Route=require('../routes/Client');
//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-url-encoded data


//app.use('api/Client',Route);
app.use("/api/auth", require("./routes/Auth"));
//connect to mongodb
mongoose.connect(process.env.DATABASE_URL);
const db=mongoose.connection;
db.on('error',error=>console.error('connection error:',error));
db.once('open',()=>console.log('connected to mongodb'));
//start server
const PORT=5000;
app.listen(process.env.PORT||5000,()=>{
    console.log('server is running on Port:5000')
});
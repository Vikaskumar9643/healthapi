const express =require('express');
const connectMongo=require('./db');
connectMongo();
const app=express();
const Route=express.Router();
const auth=require('./Routes/auth');
const diet =require('./Routes/diet')
app.use(express.json());
app.use("/auth" ,auth);
app.use("/diet" ,diet);
app.listen(5001,(error)=>{// Here I choose Port number 5001 but your can choose any according to your preference
    if(!error){
        console.log("Server is running at  5000");
    }
    else{
        console.log(error);
    }
})
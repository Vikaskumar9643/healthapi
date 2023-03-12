const mongoose=require('mongoose');
const connectMongo=()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/test').then(()=>{// Here you need to add your mongo database url to connect with database.
        console.log("database is connected");
    })

}
module.exports=connectMongo;
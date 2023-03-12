const mongoose=require("mongoose");
const {Schema}=mongoose;
const dietSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    nameoffood:{
        type:String,
        required:true,
    },
    Quantity:{
        type:String,
        required:true,
    }

})
module.exports=mongoose.model("Diet",dietSchema);

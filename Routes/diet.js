const express=require('express');
const fetchuser = require('../Middleware/Fetchuser');
const {body,validationResult } = require('express-validator');
const Diet = require('../Modle/Diet');
const router=express.Router();
router.get('/getdiet',fetchuser,async (req,res)=>{
    try{
        const diets=await Diet.find({user:req.user.id});
        res.status(200).json({type:"success",results:diets});

    }
    catch(error){
        res.status(401).send("Interval server Error");
    }

});
router.post('/creatediet',fetchuser,[
    body('nameoffood','Name of food too small').isLength(3),
    // body('Quantity','Quantity must be in number').isInt()
],async (req,res)=>{
    try{
        const error=validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({error:error.array().at(0).msg});
        }
        let {nameoffood,Quantity}=req.body;
        nameoffood=nameoffood.toUpperCase();
        const diets=await Diet.find({nameoffood:nameoffood,user:req.user.id});
        if(diets.length!=0){
           return res.status(400).json({error:"Diet is already in the list"});
        }
        else{

            Diet.create({
                user:req.user.id,
                nameoffood:nameoffood,
                Quantity:Quantity

        }).then((diet)=>{
            res.status(200).json({type:"Success",msg:"Diet is added successfully"});
        }).catch((error)=>{
            res.status(400).json({error:error});
        })
    }

    }
    catch(error){
        res.status(401).send("Interval server Error");
    }

});
router.put('/update/:id',fetchuser,async (req,res)=>{
    try{

        const {nameoffood,Quantity}=req.body;
        const updatediet={};
        if(nameoffood){
            updatediet.nameoffood=nameoffood;
    }
    if(Quantity){
        updatediet.Quantity=Quantity;
    }
    let diet=await Diet.findById(req.params.id);
    if(!diet){
        res.status(404).json({error:"Internal server error"});
    }
    if(diet.user.toString()!=req.user.id){
        res.status(401).json({error:"Not Allowed to changed"});
    }
    diet=await Diet.findByIdAndUpdate(req.params.id,{$set:updatediet},{new:true});
    
    res.status(200).json({type:'Success',msg:"Your diet is update successfully"});
}
catch(error){
    res.status(402).json({error:"Internal server error"});
}



});
router.delete('/delete/:id',fetchuser,async(req,res)=>{
    try{
        let diet=await Diet.findById(req.params.id);
        if(!diet){
            res.status(404).json({error:"Not Found"});
        }
        if(diet.user.toString()!=req.user.id){
            res.status(404).json({error:"You don't have permission"});
        }
        diet=await Diet.findByIdAndDelete(req.params.id);
        res.status(200).json({type:"Success",msg:"Diet is Deleted successfully"});
    }
    catch(error){
        res.status(400).json({error:"Internal server Error"});
    }
})
module.exports=router;
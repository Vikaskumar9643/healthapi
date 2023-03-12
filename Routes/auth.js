const express=require("express");
const user=require('../Modle/Auth');
const jwt=require('jsonwebtoken');
const {body,validationResult } = require('express-validator');
const bcryptjs = require("bcryptjs");
const fetchuser = require("../Middleware/Fetchuser");

const router=express.Router();
const JWT_SECERT="VIKASKUMAR";
router.post("/createuser",[
    body('name').isLength({min:3}).withMessage("Enter the valid name")
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array().at(0).msg});
    }
    let user1=await user.findOne({email:req.body.email});
    if(user1){
        res.status(500).json({error:"User with email is already exist"});
    }
    const salt=await bcryptjs.genSalt(10);
    const secpass= await bcryptjs.hash(req.body.password,salt);
    user.create({
        name:req.body.name,
        email:req.body.email,
        password:secpass,
    }).then((user2)=>{
        const data={
            user:{
                id:user2.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECERT);
        user2.save();
        res.status(200).json({msg:"You are sign up Succesfully",authToken:authToken});

    }).catch((error)=>{
        res.status(500).json({error:"Internal Server Error"});
    });
});
    //routes 2: Authenticate a user using Post "/auth/login"
    router.post('/login',async(req,res)=>{
        const {email,password}=req.body;
        let user1= await user.findOne({email:email});
        if(!user1){
            return res.status(400).json({error:"Please try to login with correct credentials"});

        }
        const passwordcompare=await bcryptjs.compare(password,user1.password);
        if(!passwordcompare){
            res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user1.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECERT);
        res.status(200).json({type:"Success",msg:"You are login Successfully",authToken:authToken
        })

    }
    );
    router.post('/getuser',fetchuser, async (req,res)=>{
        const userid=req.user.id;
        const User=await user.findById(userid).select("password");
        if(!User){
            res.status(400).json({error:"wrong user id"});
        }
        res.status(200).json({User});
    });
module.exports=router;
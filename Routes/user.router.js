const express=require("express")
const {UserModel}=require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const fs=require("fs")
require("dotenv").config()



const userRouter=express.Router()


userRouter.post("/signup",async(req,res)=>{
    const {firstName,lastName,email,password}=req.body
    const usermail=await UserModel.findOne({email})
        if(usermail){
            return res.send({msg:"User alredy exists"})
        }
    try{
        bcrypt.hash(password,5,async(req,hash)=>{
            const user=new UserModel({firstName,lastName,email,password:hash})
            await user.save()
            res.send({msg:"Sign up Successful"})
        })
    }catch(err){
        console.log(err)
        res.send({"Msg":"Something went wrong"})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await UserModel.find({email})
    try{
        if(user.length==0){
            res.send("Please signup first")
        }else{
            const hash_pass=user[0].password
            bcrypt.compare(password,hash_pass,async(req,result)=>{
                try {
                    if(result){
                        const token = jwt.sign({userID:user[0]._id},process.env.normal_secret,{expiresIn:"1d"})
                        const ref_token = jwt.sign({userID:user._id},process.env.refresh_secret,{expiresIn:"7d"})
                        res.send({"Msg":"Login Successful",token,ref_token,firstname:user[0].firstName,lastName:user[0].lastName})
                    }else{
                        res.send("Login failed")
                    }
                    
                } catch (error) {
                    console.log(error)
                }        
            })
        }
        
    }catch(err){
        console.log(err)
        res.send({"Msg":"Something went wrong"})
    }
})


userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    try{
        const blacklistdata=JSON.parse(fs.readFileSync("../blacklist.json","utf-8"))
        blacklistdata.push(token)
        fs.writeFileSync("../blacklist.json",JSON.stringify(blacklistdata))
        res.send("Logged out successfully")
    }catch(err){
        console.log(err)
        res.send({"Msg":"Something went wrong"})
    }
})



module.exports={
    userRouter
}
const express=require("express")
const { EventModel } = require("../models/event.model")
const { authenticate }= require("../Middleware/authenticate.middleware")
const eventRouter=express.Router()

eventRouter.get("/",authenticate,async (req,res)=>{
    let userID=req.body.userID
    try {
        let events= await EventModel.find({userID})
        res.json(events)
    } catch (error) {
        console.log(error)
    }
})
eventRouter.get("/:id",async (req,res)=>{
    
    let id=req.params.id
    try {
        let events= await EventModel.findOne({_id:id})
        res.json(events)
    } catch (error) {
        console.log(error)
    }
})

eventRouter.post("/add", authenticate ,async (req,res)=>{
    
    let {name,startdate,enddate,userID}=req.body
    let code= Math.floor(100000 + Math.random() * 9000000)
    try {
        const event= new EventModel({name,startdate,enddate,code,userID})
        await event.save()
        res.send({"msg":"Event Added to DataBase"})
        
    } catch (error) {
        console.log(error);
    }
})

eventRouter.delete("/delete/:id", async (req,res)=>{
     let id= req.params.id
    try {
        let event= await EventModel.findByIdAndDelete({_id:id})
        res.send({"msg":"Event Deleted Sucessfully"})
    } catch (error) {
        console.log(error)
    }
})


module.exports={
    eventRouter
}
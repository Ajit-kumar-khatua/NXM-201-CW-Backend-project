
const mongoose=require("mongoose")

const eventSchema= mongoose.Schema({
    name:String,
    startdate:Date,
    enddate:Date,
    code:Number,
    userID:String
})

const EventModel= mongoose.model("event",eventSchema)

module.exports={
    EventModel
}
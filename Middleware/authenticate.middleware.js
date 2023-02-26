const jwt =require("jsonwebtoken")
require('dotenv').config()
const fs=require("fs")

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization
    const blacklistedData=JSON.stringify(fs.readFileSync("./blacklist.json","utf-8"))

    if(token){
        if(blacklistedData.includes(token)){
                res.send("Login Again")
                return
            }
        try {
            const decoded=jwt.verify(token,process.env.normal_secret)
            if(decoded){
                const userID=decoded.userID
                req.body.userID=userID
                next()
            }else{
                res.send("Please login First")
            }
        } catch (error) {
            res.send({"msg":error.message})
        }
       
    }else{
        res.send("Please login First")
    }
}

module.exports={
    authenticate
}
const express = require("express")
const { connection } = require("./Config/db")
const { userRouter } = require("./Routes/user.router")
const {passport}=require("./Config/google-oauth")
const { eventRouter } = require("./Routes/event.route");
const { pollRouter } = require("./Routes/poll.route");
const cors=require("cors")
require("dotenv").config()
const socketio=require("socket.io")
const http=require("http")


const app=express()
const server=http.createServer(app)
const io=socketio(server)


app.use(cors())
app.use(express.json())

app.use("/users",userRouter)
app.use("/events",eventRouter)
app.use("/polls",pollRouter)


let users=[]

function userJoin(id,room){
    const user={id,room}
    users.push(user)
    console.log(users)
    return user
}

function getCurrentUser(id){
    return users.find(user=> user.room)
}

function userLeave(id){
    const index=users.findIndex(user=>user.id==id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

io.on("connection",(socket)=>{
    console.log("Client is Connected")
    socket.on("joinRoom",({room})=>{
        const user= userJoin(socket.id,room)
        console.log(user)

        socket.join(user.room)
    })

    socket.on("response",(msg)=>{
        const user=getCurrentUser(socket.id)

        io.to(user.room).emit("message",msg)
    })
    
    socket.on("disconnect",()=>{
        const user= userLeave(socket.id)
        console.log("Client Disconnected.")
    })
})



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

  app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.redirect('/');
  });

app.get("/",(req,res)=>{
    res.send("Welcome")
})





server.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("The server is connected to DB")
    }catch(err){
        console.log(err)
        console.log({'Msg':"Something went wrong"})
    }
    console.log(`The server is listning at port ${process.env.port}`)
})


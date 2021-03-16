const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const UserRouter=require('./routers/user')

const app=express()
const port=3000|| process.env.port


app.use(express.json())
app.use(UserRouter)


app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

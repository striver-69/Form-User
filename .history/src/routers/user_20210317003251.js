const express = require('express')
const router= new express.Router()
const User=require('../models/user')

//Route to get all users
router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        res.status(201).send({user})
    }catch(e){
        res.status(400).send(e)
    }
})

//Login Router
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findbyCredentials(req.body.email,req.body.password)
        res.send({user})
    }catch(e){
        console.log(e.message)
        res.status(400).send()
    }
})

//Router to get individual User
router.get('/users/:id',async(req,res)=>{
    const _id=req.params.id

    try{
        const user=await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }

})

//Router to update fields of user
router.patch('/users/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdate=["name","email","password","age"]
    const isvalidOperation=updates.every((property)=>{
        return allowedupdate.includes(property)
    })

    if(!isvalidOperation){
        return res.status(400).send({error:'Invalid Updates'})
    }

    try{
        const user=await User.findById(req.params.id)

        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()

        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Router to delete user.
router.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send({user})
        }
        res.status(200).send({user})
    }catch(e){
        console.log(e.message)
        res.status(500).send()
    }
})

module.exports=router
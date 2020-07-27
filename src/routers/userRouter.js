require('../db/mongoose')
const User = require('../models/user')
const express = require('express')
const router = new express.Router()

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})


router.get('/users/:id',async(req,res)=>{
    const id = req.params.id
    try{
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(500).send()
    }
})


router.get('/users',async(req,res)=>{
    try{
        const user = await User.find()
        res.send(user)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/users/:id',async(req,res)=>{
    const allowed = ['name','email','age','password']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>{
        return allowed.includes(update)
    })

    if(!isValid){
        return res.status(400).send({error : 'invalid updates'})
    }
    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update] = req.body[updates]
        })
        //const user = await User.findByIdAndUpdate(req.params.id , req.body , { new : true , runValidators :true})
        if(!user){
            return res.status(404).send()
        }
        await user.save()
        res.send(user)
    }catch(e){
        res.status(400).send()
    }
})


router.delete('/users/:id',async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch(e){
        res.status(500).send()
    }
})


module.exports = router
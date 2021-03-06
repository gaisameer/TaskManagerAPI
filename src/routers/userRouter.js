require('../db/mongoose')
const auth = require('../middlewares/auth')
const User = require('../models/user')
const express = require('express')
const router = new express.Router()


router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    
    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user : user.getPublicProfile(),token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
       // console.log(user.getPublicProfile())
        res.send({user ,token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
    
})

router.post('/user/logout', auth , async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

//logiyt all sessions
router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

/*
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
*/

router.get('/user/profile', auth,async(req,res)=>{
    try{
      //  const user = await User.find()
        res.send(req.user)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/users/me',auth,async(req,res)=>{
    const allowed = ['name','email','age','password']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>{
        return allowed.includes(update)
    })

    if(!isValid){
        return res.status(400).send({error : 'invalid updates'})
    }
    try{
        // const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update] = req.body[updates]
        })
        //const user = await User.findByIdAndUpdate(req.params.id , req.body , { new : true , runValidators :true})
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})


router.delete('/users/me',auth,async(req,res)=>{
    try{
        //const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch(e){
        res.status(500).send()
    }
})


module.exports = router
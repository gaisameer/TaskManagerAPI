require('../db/mongoose')
const Task = require('../models/task')
const User = require('../models/user')
const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.post('/tasks',auth ,async(req,res)=>{
    try{
       //const task = new Task(req.body)
       const task = new Task({
           ...req.body,
           owner : req.user._id
       })
       await task.save()
       res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})



router.get('/tasks',auth ,async(req,res)=>{
    try{
        // const tasks = await Task.find()
        // res.send(tasks)
        //const user = req.user
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
})


router.get('/tasks/:id',auth ,async(req,res)=>{
    const id = req.params.id
    try{
        //const task = await Task.findById(id)
        const task = await Task.findOne({_id:id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth , async(req,res)=>{
    const allowed = ['description','completed']
    const updates = Object.keys(req.body)

    isValid = updates.every((update)=>{
        return allowed.includes(update)
    })

    if(!isValid){
        return res.status(400).send({eror : 'invalid update'})
    }

    try{
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true , runValidators : true})
        const task = await Task.findOne({_id:req.params.id,owner: req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        task.save()
        res.send(task)
    } catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',auth ,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()  
    }
})



module.exports = router
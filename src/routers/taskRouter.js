require('../db/mongoose')
const Task = require('../models/task')
const express = require('express')
const router = new express.Router()

router.post('/tasks',async(req,res)=>{
    try{
       const task = new Task(req.body)
       await task.save()
       res.status(201).send(req.body)
    }catch(e){
        res.status(400).send(e)
    }
})



router.get('/tasks',async(req,res)=>{
    try{
        const tasks = await Task.find()
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})


router.get('/tasks/:id',async(req,res)=>{
    const id = req.params.id
    try{
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async(req,res)=>{
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
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        if(!task){
            return res.status(404).send()
        }
        task.save()
        res.send(task)
    } catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()  
    }
})



module.exports = router
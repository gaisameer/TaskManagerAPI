const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')


const app = express()
const port = process.env.PORT || 3000

/*
app.use((req,res,next)=>{
    res.status('503').send('site under maintanance')
})*/


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log('server is up ' + port)
})



const main = async() => {
    // const task = await dask.findById("5f49efc9fd57004965413b9a")
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
    const user = await User.findById("5f49ef8060359448497642da")
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)

}

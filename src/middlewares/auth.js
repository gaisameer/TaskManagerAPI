const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async(req,res,next)=> {
    console.log(req.body)
    try{

        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decoded = jwt.verify(token,'taskmanapp')
        const user = await User.findOne({_id : decoded._id , 'tokens.token':token})

        if(!user){
            console.log('no user')
            throw new Error()
        }
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error : 'Please authenicate'})
    }
}

module.exports = auth
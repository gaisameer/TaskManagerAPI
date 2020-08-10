const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name :{
    type : String,
    required : true,
    trim : true
  },

  email :{
    type : String,
    required : true,
    trim : true,
    lowercase : true,
    unique : true,

    validate(value){
      if(!validator.isEmail(value)){
        throw new Error('invalid email')
      }
    }
  },

  password :{
    type : String,
    required : true,
    trim : true,
    minlength : 7,
    validate(val){
        if (val.toLowerCase().includes('password')){
            throw new Error('contain "password" ')
        }
    }
  },

  age:{
    type: Number,
    default : 0,
    validate(val){
        if(val<0){
            throw new Error('age cant be negative')
        }
    }
  },

  tokens :[{
    token :{
      type : String,
      required : true
    }
  }]
})

//to generate web tokens
userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({_id : user._id.toString()}, 'taskmanapp')

  user.tokens = user.tokens.concat  ({ token })
  await user.save()
  return token
}


userSchema.methods.toJSON = function(){
  const user = this
  const userObject = user.toObject()
 // console.log(userObject)
 delete userObject.password
 delete userObject.tokens

  return userObject
}


//for log in
userSchema.statics.findByCredentials = async(email,password) => {
  //console.log(email,password)
  const user = await User.findOne({ email })
  //console.log(user)
  if(!user){
    console.log('email')
     throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
    console.log('password')
    throw new Error('Unable to login')
  }
  //console.log(user)
  return user
}


// to hash password when signing in and modifying user data
userSchema.pre('save',async function(next){
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next()
})



const User = mongoose.model('user',userSchema)



  module.exports = User
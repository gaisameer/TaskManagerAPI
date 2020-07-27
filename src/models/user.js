const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
  }
})

userSchema.pre('save',async function(next){
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next()
})



const user = mongoose.model('user',userSchema)



  module.exports = user
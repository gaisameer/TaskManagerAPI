const mongoose = require('mongoose')

const task = mongoose.model('task',{
    description : {
        type : String,
        required : true,
        trim : true
    },

    completed : {
        type : Boolean,
        default : false
    }
})


module.exports = task
const validator = require('validator')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if ( value < 13 ) {
        throw new Error('Debes ser mayor de 13 años')
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if( !validator.isEmail(value) ) {
        throw new Error('Email invalido')
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  }
})


userSchema.statics.findByCredentials = function(email, password) 
{
  return new Promise( function(resolve, reject) {
    User.findOne({ email }).then(function(user) {
      if (!user) {
        return reject('User does not exist')
      }
      bcryptjs.compare(password, user.password).then(function (match) {
        if( match ) {
          resolve(user)
        }
        reject('Wrong user or password')
      }).catch( function(error) {
        reject('Wrong user or password')
      })
    })
  })
}

userSchema.pre('save', function(next) {
  const user = this
  if (user.isModified('password') ) {
    bcryptjs.hash(user.password, 8).then(function(hash) {
      user.password = hash
      next()
    }).catch(function(error) {
      return next(error)
    })
  } else {
    next()
  }
})


const User = mongoose.model('User', userSchema)

module.exports = User

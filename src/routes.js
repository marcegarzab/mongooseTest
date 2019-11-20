const express = require('express')
const users = require('./controllers/users')

const router = express.Router()

router.get('/login', users.login)
router.get('/users', users.getUsers)
router.get('/users/:id', users.getUser)
router.post('/users', users.createUser)
router.patch('/users/:id', users.updateUser)
router.delete('/users/:id', users.deleteUser)

module.exports = router
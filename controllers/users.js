const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({
      error: 'Error, expected `username` to be unique.'
    })
  }
  if (password) {
    if (password.length > 2) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash
      })
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    } else {
      return response.status(400).json({
        error: 'password length must be at least 3 characters'
      })
    }
  } else {
    return response.status(400).json({
      error: 'missing password'
    })
  }
})

module.exports = usersRouter

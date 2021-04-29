const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

dotenv.config()

const generateToken = (user) => {
      return jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
      }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
      Mutation: {
            async login(_, { username, password }) {
                  const { errors, valid } = validateLoginInput(username, password)
                  if (!valid) {
                        throw new UserInputError('Errors', { errors })
                  }
                  const user = await User.findOne({ username })
                  const isMatch = await bcrypt.compare(password, user.password)
                  if (!user || !isMatch) {
                        errors.general = 'user or password is not correct'
                        throw new UserInputError('Wrong credentials', { errors })
                  }
                  const token = generateToken(user)
                  return {
                        ...user._doc,
                        id: user._id,
                        token
                  }
            },
            async register(_, {registerInput: {username, password, confirmPassword, email}}, context, info) {
                  const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
                  if (!valid) {
                        throw new UserInputError('Errors', {errors})
                  }
                  const userExists = await User.findOne({ username })
                  if (userExists) {
                        throw new UserInputError('Username is taken', {
                              errors: {
                                    username: 'This username is taken'
                              }
                        })
                  }
                  password = await bcrypt.hash(password, 12)
                  const newUser = new User({
                        email,
                        password,
                        username,
                        createdAt: new Date().toISOString()
                  })
                  const res = await newUser.save()

                  const token = generateToken(user)
                  return {
                        ...res._doc,
                        id: res._id,
                        token
                  }
            }
      }
}
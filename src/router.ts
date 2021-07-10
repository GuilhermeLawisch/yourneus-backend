import express, { Request, response } from "express";

import { AuthMiddleware } from './middlewares/auth'

const router = express.Router()

const authMiddleware = new AuthMiddleware()

router.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

  // Pass to next layer of middleware
  next();
});

router.get('/', (req, res) => {
  return res.json({ message: 'Hello World' })
})

router.post('/auth', (req, res) => {
  const { email, password } = req.body

  if (email !== 'teste@gmail.com' || password !== 'teste') {
    return res.status(400).json({ error: 'wront datas' })
  }

  return res.status(200).json({
    token: '123456',
    user: {
      name: 'Guilherme',
      email: 'teste@gmail.com',
      avatar_url: 'https://github.com/GuilhermeLawisch.png'
    }
  })
})

router.post('/userdata', authMiddleware.verification, (req, res) => {
  const { token } = req.body

  if (token !== '123456') {
    return res.status(400).json({ error: 'invalid token' })
  }

  return res.status(200).json({
    user: {
      name: 'Guilherme',
      email: 'teste@gmail.com',
      avatar_url: 'https://github.com/GuilhermeLawisch.png'
    }
  })
})

export { router }
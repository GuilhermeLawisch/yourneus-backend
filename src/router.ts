import express from "express";
require('dotenv/config');

import { AuthMiddleware } from './middlewares/auth'

import { UserController } from './controllers/UserController'
import { NewsController } from "./controllers/NewsController";

const router = express.Router()

const authMiddleware = new AuthMiddleware()

const userController = new UserController()
const newsController = new NewsController()

router.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_ACESS_CONTROL_ALLOW_ORIGIN);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"); //Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization

  // res.end()
  // Pass to next layer of middleware
  next();
});

// NEWS DATA
router.get('/news', newsController.index)
router.post('/news/create', authMiddleware.verification, newsController.create)
router.get('/news/:id', newsController.show)
router.get('/news/edit/:id', authMiddleware.verification, newsController.edit)
router.put('/news/:id', authMiddleware.verification, newsController.update)
router.delete('/news/:id', authMiddleware.verification, newsController.destroy)

// USER DATA
router.post('/user/register', userController.register)
router.post('/user/auth', userController.authenticate)
router.post('/user/data', authMiddleware.verification, userController.data)
router.put('/user/update/:id', authMiddleware.verification, userController.update)

export { router }
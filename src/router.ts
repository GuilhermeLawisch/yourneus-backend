import express, { response } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
const config = require("./config/multer");
require('dotenv/config');

import { AuthMiddleware } from './middlewares/AuthMiddleware'

import { UserController } from './controllers/UserController'
import { NewsController } from "./controllers/NewsController";

const router = express.Router()

let key
  
const upload = multer({ 
  dest: path.resolve(__dirname, 'tmp', 'uploads'),
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, 'tmp', 'uploads'))
    },
    filename: function (req, file, cb) {
      // cb(null, file.fieldname + '-' + Date.now() + '.jpg')
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, null);
  
        key = `${hash.toString("hex")}-${file.originalname}`;
  
        cb(null, key);
      });
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  } 
})

const authMiddleware = new AuthMiddleware()

const userController = new UserController()
const newsController = new NewsController()

router.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_ACESS_CONTROL_ALLOW_ORIGIN);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"); //Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization

  // res.end()
  // Pass to next layer of middleware
  next();
});

router.get('/', (req, res) => res.sendFile('tmp/uploads/file-1627308910266.jpg', { root : __dirname}))

// NEWS DATA
router.get('/news', newsController.index)
router.post('/news/create', authMiddleware.verification, newsController.create)
router.get('/news/:id', newsController.show)
router.get('/news/search/:id', newsController.search)
router.get('/news/edit/:id', authMiddleware.verification, newsController.edit)
router.put('/news/:id', authMiddleware.verification, newsController.update)
router.delete('/news/:id', authMiddleware.verification, newsController.destroy)
router.get('/news/like/:id', authMiddleware.verification, newsController.like)
router.post('/news/file', authMiddleware.verification, upload.single('file'), newsController.file)

// USER DATA
router.post('/user/register', userController.register)
router.post('/user/auth', userController.authenticate)
router.post('/user/data', authMiddleware.verification, userController.data)
router.put('/user/update/:id', authMiddleware.verification, userController.update)

export { router }
import { NextFunction, Request, Response } from "express"
import { verify } from 'jsonwebtoken';
// const authconfig = require('../../config/auth')
require('dotenv/config');

export class AuthMiddleware {
  verification(req, res:Response, next:NextFunction) {
    // EXAMPLE: Bearer hdfs15gn49unp9iup847htgp98gt4
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
      return res.status(401).send({ error: 'Token error' })
    }

    const [ scheme, token ] = parts;

    if (!/Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Token malformated' })
    }

    verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: 'Token invalid' })
      }

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_ACESS_CONTROL_ALLOW_ORIGIN);

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

      res.locals.id = decoded.id

      next()
    })
  } 
}
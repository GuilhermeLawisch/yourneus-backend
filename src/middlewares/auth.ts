import { NextFunction, Request, Response } from "express"
import { verify } from 'jsonwebtoken';
// const authconfig = require('../../config/auth')

export class AuthMiddleware {
  verification(req:Request, res:Response, next:NextFunction) {
    // Bearer hdfs15gn49unp9iup847htgp98gt4
    const authHeader = req.headers['authorization']

    // if (!authHeader) {
    //   return res.status(401).send({ error: 'No token provided' })
    // }

    // const parts = authHeader.split(' ')

    // if (parts.length !== 2) {
    //   return res.status(401).send({ error: 'Token error' })
    // }

    // const [ scheme, token ] = parts;

    // if (!/Bearer$/i.test(scheme)) {
    //   return res.status(401).send({ error: 'Token malformated' })
    // }

    // verify(token, authconfig.secret, (err, decoded) => {
    //   if (err) {
    //     return res.status(401).send({ error: 'Token invalid' })
    //   }

    //   req.userId = decoded.id
      
    //   return next()
    // })

    console.log(req.headers)

    console.log(authHeader)

    return next()
  } 
}
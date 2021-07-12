import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { v4 as uuid } from "uuid";
require('dotenv/config');

import { connectToDatabase } from '../services/db-connection';

type IUser = {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  subscribedAt?: Date;
}

export class UserController {
  async register(req:Request, res:Response) {
    const { username, email, password } = req.body

    try {
      if (username === '' || email === '' || password === '') {
        return res.status(400).json({ error: `Registration failed` })
      }

      const passwordHash = await hash(password, 10)
      
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('users')

      const userNameAlreadyExists = await collection.findOne({ username })
      const emailAlreadyExists = await collection.findOne({ email })

      if (userNameAlreadyExists || emailAlreadyExists) {
        return res.status(400).json({ error: `User already exists` })
      }

      const data = {
        id: uuid(),
        username,
        email,
        password: passwordHash,
        subscribedAt: new Date()
      }

      await collection.insertOne(data)

      data.password = undefined

      return res.status(200).json({ message: 'success' })
    } catch (err) {
      return res.status(400).json({ error: `unknown error: ${err}` })
    }
  }
  async authenticate(req:Request, res:Response) {
    const { email, password } = req.body

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('users')

      const user: IUser = await collection.findOne({ email })

      if (!await compare(password, user.password)) {
        return res.status(400).send({ error: "Invalid password" })
      }

      const token = sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: 60 * 60 * 1
      })
  
      return res.status(200).json({ user, token })

    } catch (err) {
      return res.status(200).json({ error: `unknown error: ${err}` })
    }
  }
  async data(req, res:Response) {
    const id = res.locals.id

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('users')

      const user: IUser = await collection.findOne({ id })

      if (!user) {
        return res.status(400).json({ error: 'user not found' })
      }
 
      return res.status(200).json(user)
    } catch (err) {
      return res.status(400).json({ error: `unknown error: ${err}` })
    }
  }
  async forgot_password(req:Request, res:Response) {

  }
  async reset_password(req:Request, res:Response) {

  }
}
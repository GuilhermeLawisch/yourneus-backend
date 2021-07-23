import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
require('dotenv/config');

import { connectToDatabase } from '../services/db-connection'

type INews = {
  _id?: ObjectId;
  id: string;
  title: string;
  category: string;
  content: string;
  idCreator: string;
  likes: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class NewsController {
  async index(req:Request, res:Response) {
    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      collection.find({}).sort({_id:-1}) .toArray(function(err, result) {
        if (err) throw err;
        return res.status(200).json(result)
      })
    } catch (err) {
      return res.status(400).json({ error: `unknown error: ${err}` })
    }
  }
  async create(req:Request, res:Response) {
    const id = res.locals.id

    const { title, category, content } = req.body

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      const newsAlreadyExists = await collection.findOne({ title })

      if (newsAlreadyExists) {
        return res.status(400).json({ error: 'News already exists' })
      }

      const news: INews = {
        id: uuid(),
        title,
        category,
        content,
        idCreator: id,
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await collection.insertOne(news)
 
      return res.status(200).json({ message: 'success' })
    } catch (err) {
      return res.status(400).json({ error: `unknown error: ${err}` })
    }
  }
  async show(req:Request, res:Response) {
    const id = req.params.id 

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      const news = await collection.findOne({ id })

      news._id = undefined

      return res.status(200).json(news)

    } catch (err) {
      return res.status(400).json({ error: `unknown error ${err}` })
    }
  }
  async search(req:Request, res:Response) {
    const value = req.params.id
  
    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      collection.find({ title: {'$regex': value, '$options': 'i'} }).sort({_id:-1}) .toArray(function(err, result) {
        if (err) throw err;
        return res.status(200).json(result)
      })
    } catch (err) {
      return res.status(400)
    }
  }
  async edit(req:Request, res:Response) {
    const idCreator = res.locals.id

    const id = req.params.id

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      const news = await collection.findOne({ id, idCreator })

      return res.status(200).json(news)
    } catch (err) {
      return res.status(400).json({ error: `unknown error ${err}` })
    }
  }
  async update(req:Request, res:Response) {
    const id = req.params.id

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      await collection.updateOne({ id }, { $set: {
        ...req.body,
        updatedAt: new Date()
      } })

      return res.status(200).json({ message: 'success' })
    } catch (err) {
      return res.status(400).json({ error: `unknown error ${err}` })
    }

  }
  async destroy(req:Request, res:Response) {
    const idCreator = res.locals.id

    const id = req.params.id

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      collection.deleteOne({ id, idCreator })

      return res.status(200).json({ message: 'success' })

    } catch (err) {
      return res.status(400).json({ error: `unknown error ${err}` })
    }
  }
  async like(req:Request, res:Response) {
    const idNews = req.params.id
    const idUser = res.locals.id

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI)

      const collection = db.collection('news')

      const news = await collection.findOne({ id: idNews })

      if (!news) {
        return res.status(400).json({ error: `id incorrect` })
      }

      let newsLikes = []
      let exists = false

      for (let i = 0; i < news.likes.length; i++) {
        if (news.likes[i] == idUser) {
          exists = true
        } else {
          newsLikes.push(news.likes[i])
        }
      }

      if (!exists) {
        newsLikes.push(idUser)
      }

      await collection.updateOne({ id: idNews }, { $set: { 
        likes: newsLikes
      } })

      if (exists) {
        return res.status(400).json({ message: `remove` })
      }

      return res.status(200).json({ message: 'add' })
    } catch (err) {
      return res.status(400).json({ error: `unknown error ${err}` })
    }
  }
}
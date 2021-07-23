"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const uuid_1 = require("uuid");
require('dotenv/config');
const db_connection_1 = require("../services/db-connection");
class NewsController {
    async index(req, res) {
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            collection.find({}).sort({ _id: -1 }).toArray(function (err, result) {
                if (err)
                    throw err;
                return res.status(200).json(result);
            });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error: ${err}` });
        }
    }
    async create(req, res) {
        const id = res.locals.id;
        const { title, category, content } = req.body;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            const newsAlreadyExists = await collection.findOne({ title });
            if (newsAlreadyExists) {
                return res.status(400).json({ error: 'News already exists' });
            }
            const news = {
                id: uuid_1.v4(),
                title,
                category,
                content,
                idCreator: id,
                likes: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await collection.insertOne(news);
            return res.status(200).json({ message: 'success' });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error: ${err}` });
        }
    }
    async show(req, res) {
        const id = req.params.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            const news = await collection.findOne({ id });
            news._id = undefined;
            return res.status(200).json(news);
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
    async search(req, res) {
        const value = req.params.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            collection.find({ title: { '$regex': value, '$options': 'i' } }).sort({ _id: -1 }).toArray(function (err, result) {
                if (err)
                    throw err;
                return res.status(200).json(result);
            });
        }
        catch (err) {
            return res.status(400);
        }
    }
    async edit(req, res) {
        const idCreator = res.locals.id;
        const id = req.params.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            const news = await collection.findOne({ id, idCreator });
            return res.status(200).json(news);
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
    async update(req, res) {
        const id = req.params.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            await collection.updateOne({ id }, { $set: Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }) });
            return res.status(200).json({ message: 'success' });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
    async destroy(req, res) {
        const idCreator = res.locals.id;
        const id = req.params.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            collection.deleteOne({ id, idCreator });
            return res.status(200).json({ message: 'success' });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
    async like(req, res) {
        const idNews = req.params.id;
        const idUser = res.locals.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('news');
            const news = await collection.findOne({ id: idNews });
            if (!news) {
                return res.status(400).json({ error: `id incorrect` });
            }
            let newsLikes = [];
            let exists = false;
            for (let i = 0; i < news.likes.length; i++) {
                if (news.likes[i] == idUser) {
                    exists = true;
                }
                else {
                    newsLikes.push(news.likes[i]);
                }
            }
            if (!exists) {
                newsLikes.push(idUser);
            }
            await collection.updateOne({ id: idNews }, { $set: {
                    likes: newsLikes
                } });
            if (exists) {
                return res.status(400).json({ message: `remove` });
            }
            return res.status(200).json({ message: 'add' });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
}
exports.NewsController = NewsController;

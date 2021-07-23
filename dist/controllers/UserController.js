"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
require('dotenv/config');
const db_connection_1 = require("../services/db-connection");
class UserController {
    async register(req, res) {
        const { username, email, password } = req.body;
        try {
            if (username === '' || email === '' || password === '') {
                return res.status(400).json({ error: `Registration failed` });
            }
            const passwordHash = await bcryptjs_1.hash(password, 10);
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('users');
            const userNameAlreadyExists = await collection.findOne({ username });
            const emailAlreadyExists = await collection.findOne({ email });
            if (userNameAlreadyExists || emailAlreadyExists) {
                return res.status(400).json({ error: `User already exists` });
            }
            const data = {
                id: uuid_1.v4(),
                username,
                email,
                password: passwordHash,
                subscribedAt: new Date()
            };
            await collection.insertOne(data);
            data.password = undefined;
            return res.status(200).json({ message: 'success' });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error: ${err}` });
        }
    }
    async authenticate(req, res) {
        const { email, password } = req.body;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('users');
            const user = await collection.findOne({ email });
            if (!await bcryptjs_1.compare(password, user.password)) {
                return res.status(400).json({ error: "Invalid password" });
            }
            const token = jsonwebtoken_1.sign({ id: user.id }, process.env.TOKEN_SECRET, {
                expiresIn: 60 * 60 * 1
            });
            await collection.updateOne({ id: user.id }, { $set: {
                    token
                } });
            return res.status(200).json({ user, token });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error: ${err}` });
        }
    }
    async data(req, res) {
        const id = res.locals.id;
        try {
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('users');
            const user = await collection.findOne({ id });
            if (!user) {
                return res.status(400).json({ error: 'user not found' });
            }
            return res.status(200).json(user);
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error: ${err}` });
        }
    }
    async update(req, res) {
        const idHeader = res.locals.id;
        const idParams = req.params.id;
        try {
            if (idHeader != idParams) {
                return res.status(400).json({ error: `id error` });
            }
            const db = await db_connection_1.connectToDatabase(process.env.MONGODB_URI);
            const collection = db.collection('users');
            const passwordHash = await bcryptjs_1.hash(req.body.password, 10);
            await collection.updateOne({ id: idParams }, { $set: Object.assign(Object.assign({}, req.body), { password: passwordHash, updatedAt: new Date() }) });
            return res.status(200).json({ message: `success` });
        }
        catch (err) {
            return res.status(400).json({ error: `unknown error ${err}` });
        }
    }
    async forgot_password(req, res) {
    }
    async reset_password(req, res) {
    }
}
exports.UserController = UserController;

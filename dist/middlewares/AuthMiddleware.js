"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require('dotenv/config');
class AuthMiddleware {
    verification(req, res, next) {
        const authHeader = req.headers['authorization'];
        console.log(req.headers);
        if (!authHeader) {
            console.log('No token provided');
            return res.status(401).send({ error: 'No token provided' });
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            console.log('Token error');
            return res.status(401).send({ error: 'Token error' });
        }
        const [scheme, token] = parts;
        if (!/Bearer$/i.test(scheme)) {
            console.log('Token malformated');
            return res.status(401).send({ error: 'Token malformated' });
        }
        jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log('Token invalid');
                return res.status(401).send({ error: 'Token invalid' });
            }
            res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_ACESS_CONTROL_ALLOW_ORIGIN);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
            res.locals.id = decoded.id;
            next();
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;

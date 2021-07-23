"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const url_1 = __importDefault(require("url"));
let cacheDb = null;
const connectToDatabase = async (uri) => {
    if (cacheDb) {
        return cacheDb;
    }
    const client = await mongodb_1.MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const dbName = url_1.default.parse(uri).pathname.substr(1);
    const db = client.db(dbName);
    return db;
};
exports.connectToDatabase = connectToDatabase;

import express from "express";
import cors from "cors";
import { router } from './router'

const app = express()

app.use(cors({ origin: process.env.PUBLIC_ACESS_CONTROL_ALLOW_ORIGIN }))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(router)

app.listen(3333)
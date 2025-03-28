import express from "express";
import Article from "../models/article.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

export default router;

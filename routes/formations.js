import express from "express";
import Formation from "../models/formation.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

export default router;

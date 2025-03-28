import express from "express";
import Event from "../models/event.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

export default router;

import express from "express";
import Organizer from "../models/organizer.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

export default router;

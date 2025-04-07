import express from "express";
import Opportunity from "../models/opportunity.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

export default router;

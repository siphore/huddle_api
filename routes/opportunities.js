import express from "express";
import Opportunity from "../models/opportunity.js";
import { authenticate } from "./auth.js";
import { log } from "console";

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    res.json(opportunity);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      log(req.body);
      const { title, description, club, license, NPA, location, contract } =
        req.body;

      // Save opportunity
      const newOpportunity = new Opportunity({
        title,
        description,
        club,
        license,
        NPA,
        location,
        contract,
      });

      await newOpportunity.save();
      res
        .status(201)
        .json({ message: "Opportunity created", opportunity: newOpportunity });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading opportunity" });
    }
  })
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const deletedOpportunity = await Opportunity.findByIdAndDelete(
      req.params.id
    );
    if (!deletedOpportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    res.json({
      message: "Opportunity deleted successfully",
      deletedOpportunity,
    });
  })
);

export default router;

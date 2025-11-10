import { Request, Response, NextFunction } from "express";
import { planLimits } from "../config/planLimits";
import { IUser } from "../models/user.model";

export const usageLimiter = (action: "blog" | "words") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as IUser;
    const plan = user.plan as keyof typeof planLimits;
    const limits = planLimits[plan];

    if (!limits) return res.status(403).json({ message: "Invalid plan" });

    if (action === "blog" && user.apiUsage.blogsGenerated >= limits.blogsPerMonth) {
      return res.status(403).json({
        message: "Monthly blog generation limit reached for your plan.",
      });
    }

    if (action === "words" && user.apiUsage.wordsGenerated >= limits.wordsPerMonth) {
      return res.status(403).json({
        message: "Monthly word generation limit reached for your plan.",
      });
    }

    next();
  };
};

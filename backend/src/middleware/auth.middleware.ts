import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  (req as any).user = decoded;
  next();
};

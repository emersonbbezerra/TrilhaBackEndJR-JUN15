import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

class AuthMiddleware {
  auth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: Missing token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_KEY_TOKEN!);
      if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
        request.userId = (decoded as any).id;
        next();
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      return response
        .status(401)
        .json({ error: "Unauthorized: Invalid token" });
    }
  }
}

export { AuthMiddleware };

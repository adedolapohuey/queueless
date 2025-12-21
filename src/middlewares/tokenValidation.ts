import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/tokenHandler";

interface AuthPayload {
  id: number;
  orgId?: number;
  userId?: number;
  email: string;
  iat: number;
  exp: number;
}

export interface ExtendedRequest extends Request {
  user?: Record<string, any>;
}

export const verifyAuthToken = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = verifyToken(token) as AuthPayload;

    if (!decoded.orgId && !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach the user to the request for controllers to use
    (req as any).user = decoded;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyOrgAccess = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.body?.orgId ?? req.query?.orgId; // coming from URL

    if (!orgId) {
      return res.status(403).json({ message: "Unauthorized user access" });
    }
    // Compare route orgId with token orgId
    if (parseInt(orgId, 10) !== req.user!.orgId) {
      return res
        .status(403)
        .json({ message: "Unauthorized organization access" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Unauthorized Org access" });
  }
};

export const verifyUserAccess = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body?.userId ?? req.query?.userId; // coming from URL

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized user access" });
    }

    if (parseInt(userId, 10) !== req.user!.userId) {
      return res.status(403).json({ message: "Unauthorized user access" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Unauthorized user access" });
  }
};

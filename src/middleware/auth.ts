import { RequestHandler } from "express";
import PasswordResetToken from "#/models/passwordResetToken";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "#/utils/variables";
import User from "#/models/user";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
      };
    }
  }
}

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({ owner: userId });

  if (!resetToken) {
    res
      .status(404)
      .json({ error: "Reset token for given userId was not found." });
    return;
  }

  const matched = await resetToken.compareToken(token);
  if (!matched) {
    res.status(403).json({ error: "Unauthorized access, invalid token!" });
    return;
  }

  next();
};

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(403).json({ error: "Unauthorized request." });
      return;
    }

    const payload = verify(token, config.JWT_SECRET) as JwtPayload;
    const userId = payload.userId;

    const user = await User.findOne({ _id: userId, tokens: token });
    if (!user) {
      res.status(403).json({ error: "Unauthorized request." });
      return;
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
};

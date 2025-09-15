import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    // Token nikalna
    const token =
      req.cookies?.token ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User fetch karna
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    });
  }
};


export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Not logged in.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only.",
    });
  }

  next();
};

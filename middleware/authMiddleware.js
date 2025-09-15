import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


export const authUser = async (req, res, next) => {
    const token = req.cookies?.token ||
  (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    if(!token){
        return res.status(401).json({
        success: false,
        message: "Access denied."
      })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;
        return next();

    }catch(err){
        return res.status(401).json({
        success: false,
        message: "Access denied."
      })
    }
}

export const adminOnly = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
        return res.status(403).json({
            success: false,
            message: "Admin access only."
          })
    }
    }catch(err){
        return res.status(403).json({
        success: false,
        message: "Admin access only."
      })
    }
}
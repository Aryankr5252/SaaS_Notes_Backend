import { validationResult } from "express-validator"
import userModel from "../models/userModel.js";
import tenantModel from "../models/tenantModel.js";



export const registerUser = async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    let {userName, email, password, role, slug} = req.body;

    let existingUser = await userModel.findOne({email});
    console.log(existingUser)
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    const tenant = await tenantModel.findOne({ slug});
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        userName,
        email,
        password: hashedPassword,
        role,
        slug,
        tenantId: tenant._id
    });
    await user.save();
    const token = user.generateAuthToken(user._id, tenant._id, user.role);
    res.cookie("token", token);

    res.status(201).json({user, token});
}

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');
    if(!user){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const compared = await user.comparePassword(password);

    if(!compared){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.status(201).json({user, token});
    
}

export const getUserProfile = async (req, res, next) => {

  res.status(200).json(req.user);
}

export const logoutUser = async (req, res, next) => {
  const token = req.cookies?.token ||
  (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
  
  
  res.clearCookie('token');
  
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member",
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function(userId, tenantId, role) {
  return jwt.sign({
      userId: this._id,
      tenantId: this.tenantId,
      role: this.role,
    },
    process.env.JWT_SECRET, {expiresIn: '24h'});
};

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

export default mongoose.model("User", userSchema);

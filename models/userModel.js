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
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {expiresIn: '24h'});
};

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

export default mongoose.model("User", userSchema);

import bcrypt from "bcryptjs";
import mongoose, {
  HydratedDocument,
  Model,
  Schema,
  model,
} from "mongoose";

import { IUser, UserRole } from "../types/user.types.js";

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must contain at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must contain at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email address is too long"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },

    avatar: {
      type: String,
      trim: true,
      default: undefined,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_document, returnedObject) => {
        const { password: _password, ...safeObject } = returnedObject;
        return safeObject;
      },
    },
    toObject: {
      transform: (_document, returnedObject) => {
        const { password: _password, ...safeObject } = returnedObject;
        return safeObject;
      },
    },
  },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User =
  (mongoose.models.User as UserModel | undefined) ||
  model<IUser, UserModel>("User", userSchema);

export default User;

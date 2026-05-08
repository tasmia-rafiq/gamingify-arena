import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 3,
            maxLength: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return (this.provider || 'local') === 'local';
            },
            minLength: 8,
        },
        provider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        googleId: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            default: "user",
        },
        bio: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// bcrypt password before saving to database by hashing
// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//     try {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//     } catch (error) {
//       console.log("Bcrypt error: ", error);
//     }
//   }
// });

// // compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

export const User = mongoose.model("User", userSchema);
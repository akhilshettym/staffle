import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            unique: true,
            default: () => crypto.randomUUID(),
            trim: true,
        },

        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"]
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
            maxlength: [100, "Email cannot exceed 100 characters"]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false
        },

        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
            validate: {
                validator: function (value) {
                    return value < new Date();
                },
                message: "Date of birth cannot be in the future"
            }
        },

        designation: {
            type: String,
            required: [true, "Designation is required"],
            trim: true,
            minlength: [2, "Designation must be at least 2 characters"],
            maxlength: [100, "Designation cannot exceed 100 characters"]
        },

        role: {
            type: String,
            enum: {
                values: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"],
                message: "{VALUE} is not a valid role. Must be SUPER_ADMIN, ADMIN, or EMPLOYEE",
            },
            required: [true, "User role is required"],
            uppercase: true
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            default: null,
            index: true,
        },

        permissions: {
            type: [String],
            default: [],
        },

        employmentStatus: {
            type: String,
            enum: {
                values: ["ACTIVE", "IN-ACTIVE"],
                message: "{VALUE} is not a valid employment status",
            },
            default: "ACTIVE",
            uppercase: true,
            index: true,
        },

        employmentStatusChangedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ organizationId: 1, role: 1 });

userSchema.methods.belongsToOrganization = function (orgId) {
    return this.organizationId?.equals(orgId);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;

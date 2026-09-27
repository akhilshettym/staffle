import mongoose from "mongoose";
import crypto from "node:crypto";

const taskSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true,
            unique: true,
            default: () => crypto.randomUUID(),
            trim: true,
        },

        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [25, "Title cannot exceed 25 characters"],
        },

        category: {
            type: String,
            required: [true, "Task category is required"],
            trim: true,
            minlength: [2, "Category must be at least 2 characters"],
            // make this an enum later as categories are fixed
        },

        description: {
            type: String,
            required: [true, "Task description is required"],
            trim: true,
            minlength: [10, "Description should be at least 10 characters"],
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: [true, "Task must belong to an organization"],
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Task must be assigned to a user"],
        },

        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
            validate: {
                validator: function (value) {
                    return value > new Date();
                },
                message: "Due date must be in the future",
            },
        },

        priority: {
            type: String,
            enum: {
                values: ["HIGH", "MEDIUM", "LOW"],
                message: "{VALUE} is not a valid priority. Choose HIGH, MEDIUM, or LOW",
            },
            required: [true, "Task priority is required"],
            uppercase: true,
            default: "MEDIUM",
        },

        status: {
            type: String,
            enum: {
                values: ["NEW", "IN_PROGRESS", "COMPLETED", "REJECTION_REQUESTED", "FAILED"],
                message: "{VALUE} is not a valid status. Must be NEW, IN_PROGRESS, COMPLETED, REJECTION_REQUESTED, or FAILED",
            },
            default: "NEW",
            uppercase: true,
        },

        rejection: {
            reason: {
                type: String
            },
            requestedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            requestedAt: {
                type: Date
            },
            status: {
                type: String,
                enum: ["PENDING", "APPROVED", "REJECTED"]
            },
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reviewedAt: {
                type: Date
            },
            adminReason: {
                type: String
            }
        },

        taskLifeCycle: {
            failure: {
                reason: {
                    type: String,
                    trim: true
                },
                failedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                failedAt: {
                    type: Date
                }
            }
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

taskSchema.index({ dueDate: 1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ assignedTo: 1, dueDate: 1 });
taskSchema.index({ organizationId: 1, status: 1 });

taskSchema.virtual("isOverdue").get(function () {
    if (this.status !== "COMPLETED" && this.status !== "FAILED") {
        return this.dueDate < new Date();
    }
    return false;
});

taskSchema.pre("save", function () {
    if (this.isModified("title")) {
        this.title = this.title.trim();
    }
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");

const logUserAction = require('../utils/others/logUserAction')

const User = require("../models/user.model");
const profileImage = require("../models/profileimage.model");
const UserLogs = require("../models/userlog.model")

const {
    GetAllUsersResDTO,
    GetOneUserResDTO,
    UpdateUserRoleResDTO,
    UpdateUserStatusResDTO,
    GetUserLogsResDTO,
    GetOneUserLogsResDTO
} = require("../dtos/admin.dto");

class AdminService {
    static async getallUsers() {
        try {
            const usersWithProfile = await User.aggregate([
                {
                    $lookup: {
                        from: "profileimages",
                        localField: "_id",
                        foreignField: "user",
                        as: "profileImage"
                    }
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: {
                        path: "$profileImage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$role",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        password: 0,
                        "profileImage.__v": 0,
                        "role.__v": 0
                    }
                }
            ]);

            return GetAllUsersResDTO(usersWithProfile);

        } catch (err) {
            console.error("Error fetching users with profile images:", err);
            throw new Error("Failed to fetch all users");
        }
    }

    static async getoneuser(userID) {
        try {
            if (!userID) throw new Error("User ID is required");
            if (!mongoose.isValidObjectId(userID)) throw new Error("Invalid User ID");

            const objectId = new mongoose.Types.ObjectId(userID);

            const userWithProfile = await User.aggregate([
                { $match: { _id: objectId } },
                {
                    $lookup: {
                        from: "profileimages",
                        localField: "_id",
                        foreignField: "user",
                        as: "profileImage"
                    }
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                {
                    $unwind: {
                        path: "$profileImage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$role",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        password: 0,
                        "profileImage.__v": 0,
                        "role.__v": 0
                    }
                }
            ]);

            if (!userWithProfile || userWithProfile.length === 0) {
                throw new Error("User not found");
            }

            return GetOneUserResDTO(userWithProfile[0]);
        } catch (err) {
            console.error("Error fetching user with profile image:", err);
            throw new Error("Failed to fetch user");
        }
    }

    static async UpdateUserRole(token, userid, roleid, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { $set: { role: roleid } },
            { new: true }
        );

        if (updatedUser) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(
                    req,
                    "user_role_updated",
                    `${decoded.email} successfully updated ${userid} role`,
                    metadata,
                    user._id
                );
            }

            return UpdateUserRoleResDTO()
        }
    }

    static async UpdateUserStatus(token, userid, isActive, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { $set: { isActive: isActive } },
            { new: true }
        );

        if (updatedUser) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(
                    req,
                    "user_status_updated",
                    `${decoded.email} successfully updated ${userid} status`,
                    metadata,
                    user._id
                );
            }

            return UpdateUserStatusResDTO()
        }
    }

    static async useractivities() {
        const userLogs = await UserLogs.find()
            .populate({
                path: "user",
                select: "-password"
            });


        return GetUserLogsResDTO(userLogs)
    }

    static async oneUserActivitey(userid) {
        const userLogs = await UserLogs.findById(userid)
            .populate({
                path: "user",
                select: "-password"
            });

        return GetOneUserLogsResDTO(userLogs)
    }


}

module.exports = AdminService;

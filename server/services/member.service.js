const User = require("../models/user.model")
const Member = require("../models/member.model");

const logUserAction = require("../utils/others/logUserAction");
const {
    CreateMemberPersonalDataResDTO
} = require("../dtos/member.dto");


class MemberService {
    static async createMemberPersonalData(token, fname, lname, moblie, req) {
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

        let member = await Member.findOne({ user: user._id });

        const updatedFields = {};
        if (fname) updatedFields.fname = fname;
        if (lname) updatedFields.lname = lname;
        if (moblie) updatedFields.mobile = moblie;

        if (!member) {
            member = new Member({
                user: user._id,
                ...updatedFields
            });
            await member.save();
        } else {
            await Member.updateOne(
                { user: user._id },
                { $set: updatedFields }
            );
        }
        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Update Persanl Information", `${decoded.email} Create Personal Information`, metadata, user._id);
        }
        
        return CreateMemberPersonalDataResDTO()

    }
}

module.exports = MemberService
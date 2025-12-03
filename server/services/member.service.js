const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Member = require("../models/member.model");
const logUserAction = require("../utils/others/logUserAction");

const {
    CreateMemberPersonalDataResDTO,
    CreateMemberSocialResDTO,
    CreateMemberEducationResDTO,
    CreateMemberExpResDTO
} = require("../dtos/member.dto");

class MemberService {

    static async createMemberPersonalData(token, fname, lname, mobile, gender, currentjob, shortbio, profileimage, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        let member = await Member.findOne({ user: user._id });

        const updatedFields = {};
        if (fname) updatedFields.fname = fname;
        if (lname) updatedFields.lname = lname;
        if (mobile) updatedFields.mobile = mobile;
        if (gender) updatedFields.gender = gender;
        if (currentjob) updatedFields.currentjob = currentjob;
        if (shortbio) updatedFields.shortbio = shortbio;
        if (profileimage !== undefined && profileimage !== null) updatedFields.profileimage = profileimage;

        if (!member) {
            member = new Member({
                user: user._id,
                ...updatedFields
            });
            await member.save();
        } else {
            member = await Member.findOneAndUpdate(
                { user: user._id },
                { $set: updatedFields },
                { new: true, runValidators: true }
            );
        }

        if (req) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date(),
            };
            await logUserAction(req, "Update Personal Data", `${decoded.email} updated personal data`, metadata, user._id);
        }

        return CreateMemberPersonalDataResDTO();
    }


    static async CreateSocialAccounts(token, github, linkedin, twitter, fb, website, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const member = await Member.findOne({ user: user._id });
        if (!member) throw new Error("Create personal data first");

        const updatedFields = {
            ...(github !== undefined && { github }),
            ...(linkedin !== undefined && { linkedin }),
            ...(twitter !== undefined && { twitter }),
            ...(fb !== undefined && { fb }),
            ...(website !== undefined && { website })
        };

        await Member.updateOne(
            { user: user._id },
            { $set: updatedFields }
        );

        if (req) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date(),
            };
            await logUserAction(req, "Update Social Accounts", `${decoded.email} updated social accounts`, metadata, user._id);
        }

        return CreateMemberSocialResDTO();
    }

    static async CreateEducation(token, school, course, startat, endat, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const member = await Member.findOne({ user: user._id });
        if (!member) throw new Error("Create personal data first");

        const educationEntry = {};
        if (school) educationEntry.school = school;
        if (course) educationEntry.course = course;
        if (startat) educationEntry.startat = startat;
        if (endat) educationEntry.endat = endat;

        member.education.push(educationEntry);

        const updatemember = await member.save();

        if (updatemember) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Update Education", `${decoded.email} Education Updated`, metadata, user._id);
            }

            return CreateMemberEducationResDTO()
        }
    }

    static async CreateExp(token, workplace, job, startat, endat, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const member = await Member.findOne({ user: user._id });
        if (!member) throw new Error("Create personal data first");

        const expEntry = {};
        if (workplace) expEntry.workplace = workplace;
        if (job) expEntry.job = job;
        if (startat) expEntry.startat = startat;
        if (endat) expEntry.endat = endat;

        member.exp.push(expEntry);

        const updatemember = await member.save();

        if (updatemember) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Update work experience", `${decoded.email} work experience Updated`, metadata, user._id);
            }

            return CreateMemberExpResDTO()
        }
    }
}

module.exports = MemberService;

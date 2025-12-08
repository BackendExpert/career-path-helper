const User = require("../models/user.model")
const Skill = require("../models/skill.model")

const jwt = require("jsonwebtoken")

const logUserAction = require("../utils/others/logUserAction");
const {
    CreateSkillsResDTO,
    GetAllSkillsResDTO,
    RemoveSkillResDTO
} = require("../dtos/skill.dto");


class SkillService {
    static async CreateSkill(token, skill, level, years, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkskill = await Skill.findOne({ skill: skill })

        if (checkskill) throw new Error("Skill Already Added");

        const newSkill = new Skill({
            user: user._id,
            skill: skill,
            level: level,
            exp_years: years
        })

        const resultCreateSkill = newSkill.save()

        if (resultCreateSkill) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Skill_added", `${decoded.email} Successfully added Skill`, metadata, user._id);
            }

            return CreateSkillsResDTO()
        }
    }

    static async GetAllSkills(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const getallskills = await Skill.find({ user: user._id })

        return GetAllSkillsResDTO(getallskills)
    }

    static async RemoveSkill(token, skillid, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const deleteskill = await Skill.findByIdAndDelete(skillid)

        if(deleteskill){
            if(req){
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Delete_skill", `${decoded.email} Successfully Deleted Skill`, metadata, user._id);
            }

            return RemoveSkillResDTO()
        }

    }
}

module.exports = SkillService
const User = require("../models/user.model")
const Skill = require("../models/skill.model")

const jwt = require("jsonwebtoken")



class SkillService {
    static async CreateSkill(token, skill, level, years) {
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

        if(checkskill) 


    }
}

module.exports = SkillService
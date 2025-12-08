const {
    ErrorResDTO,
    CreateSkillsDTO,
    RemoveSkillDTO
} = require("../dtos/skill.dto");
const SkillService = require("../services/skill.service");

const SkillController = {
    createNewSkill: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                skill,
                level,
                yearsofexp,
            } = req.body

            const dto = CreateSkillsDTO(token, skill, level, yearsofexp)

            const result = await SkillService.createNewSkill(
                dto.token,
                dto.skill,
                dto.level,
                dto.years,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    getallskills: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const result = await SkillService.GetAllSkills(token)

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    removeSkill: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                skillid
            } = req.params

            const dto = RemoveSkillDTO(token, skillid)

            const result = await SkillService.RemoveSkill(
                dto.token,
                dto.skillid,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = SkillController;
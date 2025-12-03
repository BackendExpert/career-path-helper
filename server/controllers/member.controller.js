const {
    ErrorResDTO,
    CreateMemberPersonalDataDTO,
    CreateMemberSocialDTO,
    CreateMemberEducationDTO,
    CreateMemberExpDTO
} = require("../dtos/member.dto");

const MemberService = require("../services/member.service");

const MemberController = {
    createMemberPersonalData: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                fname,
                lname,
                mobile,
                gender,
                currentjob,
                shortbio,
            } = req.body;

            const profileimage = req.file ? req.file.filename : null;

            const dto = CreateMemberPersonalDataDTO(
                token,
                fname,
                lname,
                mobile,
                gender,
                currentjob,
                shortbio,
                profileimage
            );

            const result = await MemberService.createMemberPersonalData(
                dto.token,
                dto.fname,
                dto.lname,
                dto.mobile,
                dto.gender,
                dto.currentjob,
                dto.shortbio,
                dto.profileimage,
                req
            );

            res.status(200).json(result);
        } catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    createSocialAccounts: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                github,
                linkedin,
                twitter,
                fb,
                website
            } = req.body;

            const dto = CreateMemberSocialDTO(token, github, linkedin, twitter, fb, website);

            const result = await MemberService.CreateSocialAccounts(
                dto.token,
                dto.github,
                dto.linkedin,
                dto.twitter,
                dto.fb,
                dto.website,
                req
            );

            res.status(200).json(result);
        } catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    createEducation: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                school,
                course,
                startat,
                endat
            } = req.body;

            const dto = CreateMemberEducationDTO(token, school, course, startat, endat);

            const result = await MemberService.CreateEducation(
                dto.token,
                dto.school,
                dto.course,
                dto.startat,
                dto.endat,
                req
            )
            res.status(200).json(result);
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    createExp: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                workplace,
                job,
                startat,
                endat
            } = req.body;

            const dto = CreateMemberExpDTO(token, workplace, job, startat, endat);

            const result = await MemberService.CreateExp(
                dto.token,
                dto.workplace,
                dto.job,
                dto.startat,
                dto.endat,
                req
            )
            res.status(200).json(result);
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }


};

module.exports = MemberController;

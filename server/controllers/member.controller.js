const {
    ErrorResDTO, 
    CreateMemberPersonalDataDTO
} = require("../dtos/member.dto");

const MemberService = require("../services/member.service");


const MemberController = {
    createMemberPersonalData: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                fname,
                lname,
                mobile
            } = req.body

            const memberpersonldatadto = CreateMemberPersonalDataDTO(token, fname, lname, mobile)

            const result = await MemberService.createMemberPersonalData(
                memberpersonldatadto.token,
                memberpersonldatadto.fname,
                memberpersonldatadto.lname,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = MemberController;
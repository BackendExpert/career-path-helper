const User = require("../models/user.model");
const Member = require("../models/member.model")

const {
    GetUserGithubProfileResDTO
} = require("../dtos/github.dto");

const github = require("../utils/apis/github");

const jwt = require("jsonwebtoken");

class GithubService {
    static async GetGithubUser(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        // const res = await github.get(`/orgs/${githubOrgName}`);

        const getmemberdata = await Member.findOne({ user: user._id })

        const res = await github.get(`/users/${getmemberdata.github}`)

        return GetUserGithubProfileResDTO(res.data)
    }
}

module.exports = GithubService
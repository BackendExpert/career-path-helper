const User = require("../models/user.model");
const Member = require("../models/member.model")

const {
    GetUserGithubProfileResDTO,
    GetUserAllReposResDTO
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

        const getmemberdata = await Member.findOne({ user: user._id })

        const res = await github.get(`/users/${getmemberdata.github}`)

        return GetUserGithubProfileResDTO(res.data)
    }

    static async GetUserAllRepos(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const getmemberdata = await Member.findOne({ user: user._id });
        if (!getmemberdata) throw new Error("Member data not found");

        let page = 1;
        let allRepos = [];
        let fetched;

        do {
            const res = await github.get(
                `/users/${getmemberdata.github}/repos?per_page=100&page=${page}`
            );
            fetched = res.data;
            allRepos = allRepos.concat(fetched);
            page++;
        } while (fetched.length === 100);

        return GetUserAllReposResDTO(allRepos);
    }

}

module.exports = GithubService
const User = require("../models/user.model");
const Member = require("../models/member.model")
const SavedRepos = require("../models/saverepo.model")

const {
    GetUserGithubProfileResDTO,
    GetUserAllReposResDTO,
    SearchRepoResDTO,
    SaveRepoResDTO,
    GetAllSavedReposResDTO
} = require("../dtos/github.dto");

const github = require("../utils/apis/github");

const logUserAction = require("../utils/others/logUserAction")

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

    static async SeachGithubRepos(token, reponame, language, filtersdate, filterenddate) {
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

        // search repo name and repo language
        let q = "";
        if (reponame && reponame.trim() !== "") q += `${reponame} `;
        if (language && language.trim() !== "") q += `language:${language} `;

        // filter by dates
        if (filtersdate && filterenddate) {
            q += `created:${filtersdate}..${filterenddate} `;
        } else if (filtersdate) {
            q += `created:>=${filtersdate} `;
        } else if (filterenddate) {
            q += `created:<=${filterenddate} `;
        }

        if (q.trim() === "") q = "stars:>1";


        try {
            // fetch repos according seach
            const response = await github.get("/search/repositories", {
                params: {
                    q,
                    sort: "stars",
                    order: "desc",
                    per_page: 100,
                    page: 1,
                },
            });

            return SearchRepoResDTO(response.data.total_count, response.data.items)

        } catch (err) {
            console.error("GitHub ERROR:", err.response?.data || err);
            throw new Error("Failed to search GitHub repositories");
        }

    }

    static async SaveRepos(token, reponame, repo_owner, req) {
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

        const checkrepo = await SavedRepos.findOne({ reponame: reponame })
        if (checkrepo) throw new Error("Repo Already Saved");

        const saverepo = new SavedRepos({
            user: user._id,
            repo_owner: repo_owner,
            reponame: reponame
        })

        const createsaverepo = await saverepo.save()

        if (createsaverepo) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Repo Saved", `${decoded.email} Repo saved ${reponame}`, metadata, user._id);
            }

            return SaveRepoResDTO()
        }
    }

    static async GetSavedRepos(token) {
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

        const getrepos = await SavedRepos.find({ user: user._id })

        const repoDataPromises = getrepos.map(async (repo) => {
            try {
                const response = await github.get(`/repos/${repo.repo_owner}/${repo.reponame}`);
                return response.data;
            } catch (err) {
                console.error(`Failed to fetch repo ${repo.repo_owner}/${repo.reponame}:`, err.message);
                return { error: `Repo ${repo.repo_owner}/${repo.reponame} not found` };
            }
        });

        const reposData = await Promise.all(repoDataPromises);

        return GetAllSavedReposResDTO(reposData)
    }

}

module.exports = GithubService
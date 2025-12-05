const {
    SearchRepoDTO,
    SaveRepoDTO,
    ErrorResDTO
} = require("../dtos/github.dto");
const GithubService = require("../services/github.service");


const GithubController = {
    getUserProfile: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const result = await GithubService.GetGithubUser(token)
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    getallrepos: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const result = await GithubService.GetUserAllRepos(token)
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    seachgithubrepos: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                reponame,
                language,
                filtersdate,
                filterenddate
            } = req.body

            const dto = SearchRepoDTO(token, reponame, language, filtersdate, filterenddate)

            const result = await GithubService.SeachGithubRepos(
                dto.token,
                dto.reponame,
                dto.language,
                dto.filtersdate,
                dto.filterenddate
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    saveRepo: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                repo
            } = req.body

            const dto = SaveRepoDTO(token, repo)

            const result = await GithubService.SaveRepos(
                dto.token,
                dto.reponame,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = GithubController;
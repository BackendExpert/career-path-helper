const {
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
        try{
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const result = await GithubService.GetUserAllRepos(token)
            res.status(200).json(result)
        }
        catch(err){
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = GithubController;
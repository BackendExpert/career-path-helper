const ArticleService = require("../services/article.service");

const {
    ErrorResDTO
} = require("../dtos/article.dto")

const ArticleController = {
    gettoparticals: async (req, res) => {
        try {
            const result = await ArticleService.GetTopArticals()
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = ArticleController;
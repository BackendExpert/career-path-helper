const ArticleService = require("../services/article.service");

const {
    ErrorResDTO,
    SaveArticleDTO
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
    },

    saveArticle: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                article
            } = req.body

            const dto = SaveArticleDTO(token, article)

            const result = await ArticleService.SavedArticle(
                dto.token,
                dto.article,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = ArticleController;
const User = require("../models/user.model")
const Member = require("../models/member.model")
const SavedArticle = require("../models/savedarticles.model")

const axios = require("axios")
const jwt = require("jsonwebtoken")

const logUserAction = require("../utils/others/logUserAction");

const article = require("../utils/apis/devto");
const {
    GetTopArticlesResDTO,
    SaveArticleResDTO,
    GetSavedArticlesResDTO
} = require("../dtos/article.dto");

class ArticleService {
    static async GetTopArticals() {
        const allArticles = [];
        let page = 1;
        const perPage = 30;
        const maxArticles = 250;

        while (allArticles.length < maxArticles) {
            const res = await axios.get('https://dev.to/api/articles', {
                params: { page, per_page: perPage }
            });

            if (!res.data || res.data.length === 0) break;

            allArticles.push(...res.data);

            if (allArticles.length >= maxArticles) break;

            page++;
        }
        const latestArticles = allArticles.slice(0, maxArticles);

        return GetTopArticlesResDTO(latestArticles);
    }

    static async SavedArticle(token, article, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkarticle = await SavedArticle.findOne({ article: article })
        if (checkarticle) throw new Error("This Articles Already Saved");

        const savearticle = new SavedArticle({
            user: user._id,
            article: article,
        })

        const savearticleresult = await savearticle.save()

        if (savearticleresult) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Article_saved", `${decoded.email} Successfully Save Article ${article}`, metadata, user._id);
            }

            return SaveArticleResDTO()
        }
    }

    static async GetSavedArticles(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const getallsavedarticles = await SavedArticle.find({ user: user._id })

        const allResults = await Promise.all(
            getallsavedarticles.map(async (saved) => {
                const res = await axios.get('https://dev.to/api/articles/search', {
                    params: {
                        q: `"${saved.article}"`, 
                        per_page: 1
                    }
                });
                return res.data; 
            })
        );

        const flatResults = allResults.flat();
        return GetSavedArticlesResDTO(flatResults)
    }
}

module.exports = ArticleService
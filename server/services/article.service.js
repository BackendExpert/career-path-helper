const User = require("../models/user.model")
const Member = require("../models/member.model")
const SavedArticle = require("../models/savedarticles.model")

const axios = require("axios")
const jwt = require("jsonwebtoken")

const logUserAction = require("../utils/others/logUserAction");

const article = require("../utils/apis/devto");
const { GetTopArticlesResDTO } = require("../dtos/article.dto");

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
}

module.exports = ArticleService
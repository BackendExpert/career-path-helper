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

        // const response = await article.get('/articles', {
        //     params: {
        //         per_page: 10, 
        //         top: 'week'  
        //     }
        // });
        const res = await axios.get('https://dev.to/api/articles', {
            params: { per_page: 20 }
        });

        return GetTopArticlesResDTO(res.data)
    }
}

module.exports = ArticleService
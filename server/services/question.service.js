const User = require("../models/user.model")
const Member = require("../models/member.model")
const Project = require("../models/project.model");
const Skill = require("../models/skill.model")
const AIProject = require("../models/aiproject.model")

const logUserAction = require("../utils/others/logUserAction");

const {
    GetAllQuestionsFromAPIResDTO
} = require("../dtos/question.dto")

const jwt = require("jsonwebtoken")
const stack = require("../utils/apis/stackapi")

class QuestionService {
    static async getquestions(filters = {}) {
        const {
            intitle,
            tagged,
            sort = "activity",
            min,
            answers,
            fromdate,
            todate,
            page = 1
        } = filters;

        const params = { site: "stackoverflow", page, pagesize: 20, sort };

        const clean = (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null);

        if (clean(intitle)) params.intitle = clean(intitle);

        if (clean(tagged)) {
            params.tagged = clean(tagged).replace(/\s+/g, ";");
        }

        if (clean(min)) params.min = clean(min);
        if (clean(answers)) params.answers = clean(answers);
        if (clean(fromdate)) params.fromdate = clean(fromdate);
        if (clean(todate)) params.todate = clean(todate);

        const response = await stack.get("/search", { params });

        return GetAllQuestionsFromAPIResDTO(response.data.items);
    }
}

module.exports = QuestionService
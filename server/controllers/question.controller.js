const {
    ErrorResDTO,
} = require("../dtos/question.dto");
const QuestionService = require("../services/question.service");

const QuestionController = {
    seachQuestion: async (req, res) => {
        try {
            const {
                intitle,
                tagged,
                sort,
                min,
                answers,
                fromdate,
                todate,
                page
            } = req.query;

            const filters = { intitle, tagged, sort, min, answers, fromdate, todate, page };

            const result = await QuestionService.getquestions(filters)

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = QuestionController;
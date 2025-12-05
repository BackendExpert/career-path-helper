const {
    ErrorResDTO,
    ConnectProjectDTO
} = require("../dtos/project.dto");
const ProjectSerivce = require("../services/project.service");

const ProjectController = {
    connectProject: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const {
                project_name
            } = req.body

            const dto = ConnectProjectDTO(token, project_name)

            const reuslt = await ProjectSerivce.ConnectProject(
                dto.token,
                dto.project_name,
                req
            )

            res.status(200).json(reuslt)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    getconnectedprojects: async (req, res) => {
        try{
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const result = await ProjectSerivce.GetConnectedProjects(token)
            res.status(200).json(result)
        }
        catch(err){
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = ProjectController;
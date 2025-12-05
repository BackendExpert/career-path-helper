const User = require("../models/user.model")
const Member = require("../models/member.model")
const Project = require("../models/project.model");

const logUserAction = require("../utils/others/logUserAction");
const {
    ConnectProjectResDTO,
    GetConnectedProjectsResDTO
} = require("../dtos/project.dto");

const github = require('../utils/apis/github')

const jwt = require("jsonwebtoken")


class ProjectSerivce {
    static async ConnectProject(token, project_name, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const getmemberdata = await Member.findOne({ user: user._id });
        if (!getmemberdata) throw new Error("Member data not found");

        const checkproject = await Project.findOne({ project_name: project_name })
        if (checkproject) throw new Error("Project Already Connected");

        const connectproject = new Project({
            user: user._id,
            project_name: project_name
        })

        const resultconntect = await connectproject.save()

        if (resultconntect) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "Project Connected", `${decoded.email} Successfully Connect Project ${project_name}`, metadata, user._id);
            }

            return ConnectProjectResDTO()
        }
    }
    static async GetConnectedProjects(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const getmemberdata = await Member.findOne({ user: user._id });
        if (!getmemberdata) throw new Error("Member data not found");

        const getallproject = await Project.find({ user: user._id });

        const projectDataPromises = getallproject.map(async (proj) => {
            try {
                const response = await github.get(`/repos/${getmemberdata.github}/${proj.project_name}`);
                return response.data;
            } catch (err) {
                console.error(`Failed to fetch project ${getmemberdata.github}/${proj.project_name}:`, err.message);
                return { error: `Project ${proj.project_name} not found` };
            }
        });

        const githubProjects = await Promise.all(projectDataPromises);

        return GetConnectedProjectsResDTO(githubProjects);
    }

}

module.exports = ProjectSerivce
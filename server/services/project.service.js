const User = require("../models/user.model")
const Member = require("../models/member.model")
const Project = require("../models/project.model");
const Skill = require("../models/skill.model")
const AIProject = require("../models/aiproject.model")

const logUserAction = require("../utils/others/logUserAction");

const createGeminiClient = require("../utils/apis/aiapi")
const github = require('../utils/apis/github')

const {
    ConnectProjectResDTO,
    GetConnectedProjectsResDTO
} = require("../dtos/project.dto");

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

    // static async CreateAIProject(token, req) {
    //     let decoded;

    //     try {
    //         decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     } catch (err) {
    //         if (err.name === "TokenExpiredError") throw new Error("Token expired");
    //         throw new Error("Invalid token");
    //     }

    //     const user = await User.findOne({ email: decoded.email });
    //     if (!user) throw new Error("User not found");

    //     const member = await Member.findOne({ user: user._id });
    //     if (!member) throw new Error("Member not found");

    //     if (!member.aiapi) throw new Error("Member not Provided Gimini AI API, Please Provid your AI API");

    //     const skills = await Skill.find({ user: user._id });

    //     if (skills.length === 0) throw new Error("No Skills Found");

    //     const formattedSkills = skills.map(s => {
    //         return `${s.skill} (Level: ${s.level}, Experience: ${s.exp_years} years)`;
    //     }).join(", ");

    //     const chunkSize = 10; 
    //     const skillChunks = [];
    //     for (let i = 0; i < formattedSkills.length; i += chunkSize) {
    //         skillChunks.push(formattedSkills.slice(i, i + chunkSize).join(", "));
    //     }

    //     const prompt = `
    //         The user has the following skills:
    //         ${formattedSkills}

    //         Based on these skills, generate:

    //         1. 5 real-world project ideas the user can develop.
    //         2. For each project include:
    //         - Project Title
    //         - Short Description
    //         - Technologies to Use
    //         - Why this project matches the user's skill set
    //         - Step-by-step development plan (Step 1, Step 2, Step 3...)
    //         - Suggestions for improvement and scaling

    //         Output MUST follow this format exactly:

    //         Project 1:
    //         Project Name:
    //         Description:
    //         Tech:
    //         Why Good:
    //         Steps:
    //         Suggestions:

    //         (Repeat for 5 projects)
    //     `;

    //     const gemini = createGeminiClient(member.aiapi);

    //     const response = await gemini.post(
    //         "/models/gemini-2.5-flash:generateContent",
    //         {
    //             contents: [
    //                 {
    //                     parts: [
    //                         {
    //                             text: prompt
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     );

    //     const aiText =
    //         response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //         "";

    //     const parsedProjects = [];

    //     const blocks = aiText.split(/Project \d+:/).filter(b => b.trim() !== "");

    //     for (let block of blocks) {
    //         const project_name = block.match(/Project Name:\s*(.*)/)?.[1] || "";
    //         const description = block.match(/Description:\s*([\s\S]*?)Tech:/)?.[1]?.trim() || "";
    //         const tech = block.match(/Tech:\s*(.*)/)?.[1] || "";
    //         const whygood = block.match(/Why Good:\s*([\s\S]*?)Steps:/)?.[1]?.trim() || "";
    //         const steps = block.match(/Steps:\s*([\s\S]*?)Suggestions:/)?.[1]?.trim() || "";
    //         const suggestions = block.match(/Suggestions:\s*([\s\S]*)/)?.[1]?.trim() || "";

    //         parsedProjects.push({
    //             project_name,
    //             description,
    //             tech,
    //             whygood,
    //             steps,
    //             suggestions
    //         });
    //     }

    //     const saveData = await AIProject.create({
    //         user: user._id,
    //         promt: prompt,
    //         text: parsedProjects
    //     });

    //     if (saveData) {
    //         if (req) {
    //             const metadata = {
    //                 ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    //                 userAgent: req.headers["user-agent"],
    //                 timestamp: new Date(),
    //             };
    //             await logUserAction(req, "ai_project_created", `${decoded.email} Successfully Create AI Project`, metadata, user._id);
    //         }

    //         return CreateAIPorjectResDTO()
    //     }

    // }

    static async CreateAIProject(token, req) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const member = await Member.findOne({ user: user._id });
        if (!member) throw new Error("Member not found");

        if (!member.aiapi) throw new Error("Member not Provided Gimini AI API, Please Provid your AI API");

        const skills = await Skill.find({ user: user._id });

        if (skills.length === 0) throw new Error("No Skills Found");

        const formattedSkills = skills.map(s => {
            return `${s.skill} (Level: ${s.level}, Experience: ${s.exp_years} years)`;
        }).join(", ");

        const prompt = `
        The user has the following skills:
        ${formattedSkills}

        Based on these skills, generate:

        1. 5 real-world project ideas the user can develop.
        2. For each project include:
        - Project Title
        - Short Description
        - Technologies to Use
        - Why this project matches the user's skill set
        - Step-by-step development plan (Step 1, Step 2, Step 3...)
        - Suggestions for improvement and scaling

        Output MUST follow this format exactly:

        Project 1:
        Project Name:
        Description:
        Tech:
        Why Good:
        Steps:
        Suggestions:

        (Repeat for 5 projects)
    `;

        const gemini = createGeminiClient(member.aiapi);

        let response;
        try {
            response = await gemini.post(
                "/models/gemini-2.5-flash:generateContent",
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                }
            );
        } catch (err) {
            if (err.response?.status === 503) {
                throw new Error("Gemini API is temporarily unavailable (503). Please try again later.");
            }
            throw err;
        }

        const aiText =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        const parsedProjects = [];

        const blocks = aiText.split(/Project \d+:/).filter(b => b.trim() !== "");

        for (let block of blocks) {
            const project_name = block.match(/Project Name:\s*(.*)/)?.[1] || "";
            const description = block.match(/Description:\s*([\s\S]*?)Tech:/)?.[1]?.trim() || "";
            const tech = block.match(/Tech:\s*(.*)/)?.[1] || "";
            const whygood = block.match(/Why Good:\s*([\s\S]*?)Steps:/)?.[1]?.trim() || "";
            const steps = block.match(/Steps:\s*([\s\S]*?)Suggestions:/)?.[1]?.trim() || "";
            const suggestions = block.match(/Suggestions:\s*([\s\S]*)/)?.[1]?.trim() || "";

            parsedProjects.push({
                project_name,
                description,
                tech,
                whygood,
                steps,
                suggestions
            });
        }

        const saveData = await AIProject.create({
            user: user._id,
            promt: prompt,
            text: parsedProjects
        });

        if (saveData) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: new Date(),
                };
                await logUserAction(req, "ai_project_created", `${decoded.email} Successfully Create AI Project`, metadata, user._id);
            }

            return CreateAIPorjectResDTO()
        }
    }


}

module.exports = ProjectSerivce
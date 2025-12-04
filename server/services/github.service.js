const User = require("../models/user.model")

class GithubService {
    static async GetGithubUser(token) {
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Token expired");
            throw new Error("Invalid token");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        
    }
}

module.exports = GithubService
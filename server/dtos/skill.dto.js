exports.CreateSkillsDTO = (token, skill, level, years) => ({ token, skill, level, years })
exports.CreateSkillsResDTO = (message="Skill Added Success") => ({ success: true, message })

exports.GetAllSkillsResDTO = (result, message="All Skills are fetched") => ({ success: true, result, message })

exports.RemoveSkillDTO = (token, skillid) => ({ token, skillid })
exports.RemoveSkillResDTO = (message="Skill Removed Successfully") => ({ success: true, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
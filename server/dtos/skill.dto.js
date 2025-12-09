exports.CreateSkillsDTO = (token, skill, level, years) => ({ token, skill, level, years })
exports.CreateSkillsResDTO = (message="Skill Added Success") => ({ success: true, message })

exports.GetAllSkillsResDTO = (result, message="All Skills are fetched") => ({ success: true, result, message })

exports.RemoveSkillDTO = (token, skillid) => ({ token, skillid })
exports.RemoveSkillResDTO = (message="Skill Removed Successfully") => ({ success: true, message })

exports.GenarateSkillPlanDTO = (token, aboutme) => ({ token, aboutme })
exports.GenarateSkillPlanResDTO = (message="Skill Plan Genarated Successfull") => ({ success: true, message })

exports.GetAllSkillPlansResDTO = (result, message="All Skill Plans fetched Successfully") => ({ success: true, result, message })

exports.GetOneSkillPlanResDTO = (result, message="One Skill Plane Fetched Succssfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
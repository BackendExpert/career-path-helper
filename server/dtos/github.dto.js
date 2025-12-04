exports.GetUserGithubProfileResDTO = (result, message="User Github Profile Fetched Successfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
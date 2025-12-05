exports.ConnectProjectDTO = (token, project_name) => ({ token, project_name })
exports.ConnectProjectResDTO = (message = "Project Connected Successully") => ({ success: true, message})

exports.GetConnectedProjectsResDTO = (result, message = "All Connected Projects Fetched Successfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
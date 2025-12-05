exports.GetUserGithubProfileResDTO = (result, message="User Github Profile Fetched Successfully") => ({ success: true, result, message })

exports.GetUserAllReposResDTO = (result, message="User Repos Fetched Successufully") => ({ success: true, result, message })

exports.SearchRepoDTO = (token, reponame, language, filtersdate, filterenddate) => ({ token, reponame, language, filtersdate, filterenddate })
exports.SearchRepoResDTO = (count, result, message = "Search Repo Successfully") => ({ success: true, count, result, message})

exports.SaveRepoDTO = (token, reponame, repo_owner) => ({ token, reponame, repo_owner })
exports.SaveRepoResDTO = (message = "Repo Saved Successfully") => ({ success: true, message})

exports.GetAllSavedReposResDTO = (result, message="Saved Repos Fetched Successfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
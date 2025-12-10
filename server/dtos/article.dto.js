exports.GetTopArticlesResDTO = (result, message="Top Articles Fetched Successfully") => ({ success: true, result, message })

exports.SaveArticleDTO = (token, article) => ({ token, article })
exports.SaveArticleResDTO = (message="Article Saved Successfull") => ({ success: true, message})

exports.GetSavedArticlesResDTO = (result, message="Saved Articles Fetched Successfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
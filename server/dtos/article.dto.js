exports.GetTopArticlesResDTO = (result, message="Top Articles Fetched Successfully") => ({ success: true, result, message })

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
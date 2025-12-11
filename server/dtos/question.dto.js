exports.GetAllQuestionsFromAPIResDTO = (result, message="all questions fetched successfully") => ({ success:true, result, message})

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});
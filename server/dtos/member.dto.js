exports.CreateMemberPersonalDataDTO = (token, fname, lname, moblie) => ({ token, fname, lname, moblie })
exports.CreateMemberPersonalDataResDTO = (message="User Persanl Data Created Successful") => ({ success: true, message})

exports.CreateMemberSocialDTO = (token, github, linkedin, twitter, fb, website) => ({ token, github, linkedin, twitter, fb, website })
exports.CreateMemberSocialResDTO = (message="User Social Accounts Added Successful") => ({ success: true, message})

exports.CreateMemberEducationDTO = (token, school, course, startat, endat) => ({ token, school, course, startat, endat })
exports.CreateMemberEducationResDTO = (message="User Education Saved Successfull") => ({ success: true, message})

exports.CreateMemberExpDTO = (token, workplace, job, startat, endat) => ({ token, workplace, job, startat, endat })
exports.CreateMemberExpResDTO = (message="User Experience Saved Successfull") => ({ success: true, message})

exports.CreateMemberAIAPIDTO = (token, aiapi ) => ({ token, aiapi })
exports.CreateMemberExpResDTO = (message="User AI API Saved Successfull") => ({ success: true, message})

exports.ErrorResDTO = (message = "Something went wrong") => ({ success: false, message })
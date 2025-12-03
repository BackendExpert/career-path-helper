exports.CreateMemberPersonalDataDTO = (token, fname, lname, mobile, gender, currentjob, shortbio, profileimage) => ({
    token,
    fname,
    lname,
    mobile,
    gender,
    currentjob,
    shortbio,
    profileimage
});
exports.CreateMemberPersonalDataResDTO = (message = "User Personal Data Saved Successfully") => ({
    success: true,
    message
});

exports.CreateMemberSocialDTO = (token, github, linkedin, twitter, fb, website) => ({
    token,
    github,
    linkedin,
    twitter,
    fb,
    website
});
exports.CreateMemberSocialResDTO = (message = "User Social Accounts Updated Successfully") => ({
    success: true,
    message
});

exports.CreateMemberEducationDTO = (token, school, course, startat, endat) => ({
    token,
    school,
    course,
    startat,
    endat
});
exports.CreateMemberEducationResDTO = (message = "User Education Saved Successfully") => ({
    success: true,
    message
});

exports.CreateMemberExpDTO = (token, workplace, job, startat, endat) => ({
    token,
    workplace,
    job,
    startat,
    endat
});
exports.CreateMemberExpResDTO = (message = "User Experience Saved Successfully") => ({
    success: true,
    message
});

exports.CreateMemberAIAPIDTO = (token, aiapi) => ({
    token,
    aiapi
});
exports.CreateMemberAIAPIResDTO = (message = "User AI API Saved Successfully") => ({
    success: true,
    message
});

exports.ErrorResDTO = (message = "Something went wrong") => ({
    success: false,
    message
});

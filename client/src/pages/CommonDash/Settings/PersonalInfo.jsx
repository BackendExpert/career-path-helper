import React from "react";
import DefaultInput from "../../../component/Form/DefaultInput";
import Dropdown from "../../../component/Form/Dropdown";
import FileInput from "../../../component/Form/FileInput";
import TextAreaInput from "../../../component/Form/TextAreaInput";
import useForm from "../../../hooks/useForm";

const PersonalInfo = () => {
    const { values, handleChange } = useForm({
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        gender: "",
        currentjob: "",
        fb: "",
        linkedin: "",
        github: "",
        twitter: "",
        website: "",
        bio: "",
        avatar: null
    });

    return (
        <div className="p-2">
            <form method="post" className="space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="First Name"
                        placeholder="Enter First Name"
                        name="fname"
                        value={values.fname}
                        required
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Last Name"
                        placeholder="Enter Last Name"
                        name="lname"
                        value={values.lname}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="Email Address"
                        placeholder="Enter Email"
                        name="email"
                        value={values.email}
                        required
                        onChange={handleChange}
                        type="email"
                    />

                    <DefaultInput
                        label="Mobile Number"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        value={values.mobile}
                        required
                        onChange={handleChange}
                        type="tel"
                    />
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Dropdown
                        label="Gender"
                        name="gender"
                        required
                        onChange={handleChange}
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                        ]}
                    />

                    <DefaultInput
                        label="Current Job"
                        placeholder="e.g. Software Engineer"
                        name="currentjob"
                        value={values.currentjob}
                        onChange={handleChange}
                    />
                </div>

                {/* SOCIAL LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="Facebook Link"
                        placeholder="Facebook Profile URL"
                        name="fb"
                        value={values.fb}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="LinkedIn Link"
                        placeholder="LinkedIn Profile URL"
                        name="linkedin"
                        value={values.linkedin}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="GitHub Link"
                        placeholder="GitHub Profile URL"
                        name="github"
                        value={values.github}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Twitter Link"
                        placeholder="Twitter Profile URL"
                        name="twitter"
                        value={values.twitter}
                        onChange={handleChange}
                    />
                </div>

                {/* WEBSITE */}
                <DefaultInput
                    label="Website / Portfolio"
                    placeholder="Enter your website link"
                    name="website"
                    value={values.website}
                    onChange={handleChange}
                />

                {/* BIO */}
                <TextAreaInput
                    label="Short Bio"
                    name="bio"
                    rows={4}
                    value={values.bio}
                    onChange={handleChange}
                    placeholder="Write a short introduction about yourself..."
                />

                {/* FILE UPLOAD */}
                <FileInput
                    label="Upload Profile Picture"
                    name="avatar"
                    onChange={handleChange}
                    accept="image/*"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-emerald-400 to-cyan-400
                           hover:from-emerald-500 hover:to-cyan-500 transition-all duration-200 shadow-md"
                >
                    Save Changes
                </button>

            </form>
        </div>
    );
};

export default PersonalInfo;

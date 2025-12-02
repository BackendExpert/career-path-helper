import React from "react";
import DefaultInput from "../../../component/Form/DefaultInput";
import Dropdown from "../../../component/Form/Dropdown";
import FileInput from "../../../component/Form/FileInput";
import TextAreaInput from "../../../component/Form/TextAreaInput";
import useForm from "../../../hooks/useForm";
import DefaultButton from "../../../component/Buttons/DefaultButton";

const PersonalInfo = () => {
    const { values, handleChange } = useForm({
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        gender: "",
        currentjob: "",
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

                <div className="">
                    <DefaultButton 
                        type="submit"
                        label="Save Profile"
                    />
                </div>

            </form>
        </div>
    );
};

export default PersonalInfo;

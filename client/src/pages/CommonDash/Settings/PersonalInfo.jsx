import React, { useState } from "react";
import DefaultInput from "../../../component/Form/DefaultInput";
import Dropdown from "../../../component/Form/Dropdown";
import FileInput from "../../../component/Form/FileInput";
import TextAreaInput from "../../../component/Form/TextAreaInput";
import useForm from "../../../hooks/useForm";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const PersonalInfo = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange, setFieldValue } = useForm({
        fname: "",
        lname: "",
        mobile: "",
        gender: "",
        currentjob: "",
        shortbio: "",
        profileimage: null
    });

    const handleFile = (e) => {
        setFieldValue("profileimage", e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key !== "profileimage") formData.append(key, values[key]);
            });

            if (values.profileimage) {
                formData.append("profileimage", values.profileimage);
            }

            const res = await API.post(
                "/member/create-member-personaldata",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success === true) {
                setToast({ success: true, message: res.data.message });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            {toast && <Toast success={toast.success} message={toast.message} />}

            <form method="post" onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="First Name"
                        placeholder="Enter First Name"
                        name="fname"
                        value={values.fname}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Last Name"
                        placeholder="Enter Last Name"
                        name="lname"
                        value={values.lname}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <DefaultInput
                        label="Mobile Number"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        value={values.mobile}
                        onChange={handleChange}
                        type="tel"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Dropdown
                        label="Gender"
                        name="gender"
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

                <TextAreaInput
                    label="Short Bio"
                    name="shortbio"
                    rows={4}
                    value={values.shortbio}
                    onChange={handleChange}
                    placeholder="Write a short introduction about yourself..."
                />

                <FileInput
                    label="Upload Profile Picture"
                    name="profileimage"
                    onChange={handleFile}
                    accept="image/*"
                />

                <DefaultButton
                    type="submit"
                    label={loading ? "Saving..." : "Save Profile"}
                />
            </form>
        </div>
    );
};

export default PersonalInfo;

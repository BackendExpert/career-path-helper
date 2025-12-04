import React, { useState } from "react";
import DefaultInput from "../../../component/Form/DefaultInput";
import Dropdown from "../../../component/Form/Dropdown";
import FileInput from "../../../component/Form/FileInput";
import TextAreaInput from "../../../component/Form/TextAreaInput";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const PersonalInfo = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [formValues, setFormValues] = useState({
        fname: "",
        lname: "",
        mobile: "",
        gender: "",
        currentjob: "",
        shortbio: "",
        profileimage: null
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) setFormValues((prev) => ({ ...prev, profileimage: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            // Append all fields
            for (let key in formValues) {
                if (key === "profileimage" && formValues[key] instanceof File) {
                    formData.append(key, formValues[key]); // append file correctly
                } else {
                    formData.append(key, formValues[key] || "");
                }
            }

            const res = await API.post("/member/create-member-personaldata", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="First Name"
                        name="fname"
                        value={formValues.fname}
                        onChange={handleChange}
                        placeholder="Enter First Name"
                    />
                    <DefaultInput
                        label="Last Name"
                        name="lname"
                        value={formValues.lname}
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                    />
                </div>

                <DefaultInput
                    label="Mobile Number"
                    name="mobile"
                    value={formValues.mobile}
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                    type="tel"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Dropdown
                        label="Gender"
                        name="gender"
                        value={formValues.gender}
                        onChange={handleChange}
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                        ]}
                    />
                    <DefaultInput
                        label="Current Job"
                        name="currentjob"
                        value={formValues.currentjob}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                    />
                </div>

                <TextAreaInput
                    label="Short Bio"
                    name="shortbio"
                    value={formValues.shortbio}
                    onChange={handleChange}
                    placeholder="Write a short introduction about yourself..."
                    rows={4}
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

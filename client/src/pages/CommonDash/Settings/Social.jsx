import React, { useState } from "react";
import useForm from "../../../hooks/useForm";
import DefaultInput from "../../../component/Form/DefaultInput";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import API from "../../../services/api";
import Toast from "../../../component/Toast/Toast";

const Social = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({
        github: "",
        linkedin: "",
        twitter: "",
        fb: "",
        website: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/member/create-social-accounts",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            const message =
                err.response?.data?.message || "Request failed. Please try again.";
            setToast({ success: false, message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 space-y-6">
            {toast && <Toast success={toast.success} message={toast.message} />}

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200">
                <span className="font-semibold text-emerald-600 uppercase">Important:</span>
                <span className="ml-1 text-gray-700">
                    GitHub must contain only your username. This system will fetch your GitHub activity.
                </span>
            </div>

            <form onSubmit={handleSubmit} method="post" className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="GitHub Username"
                        placeholder="e.g. jovinperera"
                        name="github"
                        value={values.github}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="LinkedIn"
                        placeholder="Enter LinkedIn Profile URL"
                        name="linkedin"
                        value={values.linkedin}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="Twitter / X"
                        placeholder="Enter Twitter username or URL"
                        name="twitter"
                        value={values.twitter}
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Facebook"
                        placeholder="Enter Facebook Profile URL"
                        name="fb"
                        value={values.fb}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1">
                    <DefaultInput
                        label="Website / Portfolio"
                        placeholder="Enter your website or portfolio URL"
                        name="website"
                        value={values.website}
                        onChange={handleChange}
                    />
                </div>

                <DefaultButton type="submit" label={loading ? "Saving..." : "Save Accounts"} />
            </form>
        </div>
    );
};

export default Social;

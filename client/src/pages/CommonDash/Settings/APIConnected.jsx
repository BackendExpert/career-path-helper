import React, { useState } from "react";
import useForm from "../../../hooks/useForm";
import DefaultInput from "../../../component/Form/DefaultInput";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const APIConnected = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange, resetForm } = useForm({
        aiapi: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/member/create-aiapi",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
                resetForm();
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Request failed. Please try again.";

            setToast({ success: false, message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 space-y-6">
            {toast && <Toast success={toast.success} message={toast.message} />}

            {/* IMPORTANT MESSAGE */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200">
                <span className="font-semibold text-emerald-600 uppercase">Important:</span>
                <span className="ml-1 text-gray-700">
                    Enter your <strong>ChatGPT API Key</strong>.
                    Only ChatGPT API is supported now — Gemini support coming soon.
                </span>
            </div>

            {/* FORM */}
            <form method="post" className="space-y-6" onSubmit={handleSubmit}>
                <DefaultInput
                    label="ChatGPT API Key"
                    placeholder="Enter your API key here"
                    name="aiapi"
                    value={values.aiapi}
                    required
                    onChange={handleChange}
                />

                <DefaultButton
                    type="submit"
                    label={loading ? "Saving..." : "Save API Key"}
                />
            </form>
        </div>
    );
};

export default APIConnected;

import React, { useState } from "react";
import useForm from "../../../hooks/useForm";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import DefaultInput from "../../../component/Form/DefaultInput";
import DateInput from "../../../component/Form/DateInput";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const Experience = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange, resetForm } = useForm({
        workplace: "",
        job: "",
        startat: "",
        endat: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/member/create-exp",
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

            <form method="post" onSubmit={handleSubmit} className="space-y-6">

                <DefaultInput
                    label="Work Place/Company"
                    placeholder="Enter Work Place/Company"
                    name="workplace"
                    value={values.workplace}
                    required
                    onChange={handleChange}
                />

                <DefaultInput
                    label="Position"
                    placeholder="Software Engineer, Tech Lead..."
                    name="job"
                    value={values.job}
                    required
                    onChange={handleChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateInput
                        label="Start Date"
                        name="startat"
                        value={values.startat}
                        required
                        onChange={handleChange}
                    />

                    <DateInput
                        label="End Date"
                        name="endat"
                        value={values.endat}
                        onChange={handleChange}
                    />
                </div>

                <DefaultButton
                    type="submit"
                    label={loading ? "Saving..." : "Save Experience"}
                />
            </form>
        </div>
    );
};

export default Experience;

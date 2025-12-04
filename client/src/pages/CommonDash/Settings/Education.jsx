import React, { useEffect, useState } from "react";
import useForm from "../../../hooks/useForm";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import DefaultInput from "../../../component/Form/DefaultInput";
import DateInput from "../../../component/Form/DateInput";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const Education = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({
        school: "",
        course: "",
        startat: "",
        endat: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/member/create-education",
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

    const [memberdata, setmemberdata] = useState([])

    useEffect(() => {
        const fetchmemberdata = async () => {
            try {
                const res = await API.get(`/member/get-member-data?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setmemberdata(res.data.result);
            }
            catch (err) {
                console.log(err)
            }
        }

        if (token) fetchmemberdata()
    }, [token])

    return (
        <div className="p-2 space-y-6">
            {toast && <Toast success={toast.success} message={toast.message} />}

            <form method="post" onSubmit={handleSubmit} className="space-y-6">

                <DefaultInput
                    label="School/University"
                    placeholder="Enter University/School"
                    name="school"
                    value={values.school}
                    required
                    onChange={handleChange}
                />

                <DefaultInput
                    label="Course"
                    placeholder="BSc, MSc..."
                    name="course"
                    value={values.course}
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
                    label={loading ? "Saving..." : "Save Educations"}
                />
            </form>

            <div className="">
                {memberdata?.education?.length > 0 ? (
                    memberdata.education.map((edu, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm"
                        >
                            <div className="text-lg font-semibold text-gray-800">
                                {edu.school || "Unknown School"}
                            </div>

                            {edu.course && (
                                <div className="text-sm text-gray-600 mt-1">
                                    {edu.course}
                                </div>
                            )}

                            {(edu.startat || edu.endat) && (
                                <div className="text-xs text-gray-500 mt-2">
                                    {edu.startat && !isNaN(new Date(edu.startat).getTime())
                                        ? new Date(edu.startat).toLocaleDateString()
                                        : ""}

                                    {" — "}

                                    {edu.endat && !isNaN(new Date(edu.endat).getTime())
                                        ? new Date(edu.endat).toLocaleDateString()
                                        : "Present"}
                                </div>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">No education records found.</div>
                )}
            </div>
        </div>
    );
};

export default Education;

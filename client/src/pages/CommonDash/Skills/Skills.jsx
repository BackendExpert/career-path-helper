import React, { useEffect, useState } from 'react';
import useForm from '../../../hooks/useForm';
import DefaultInput from '../../../component/Form/DefaultInput';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import Dropdown from '../../../component/Form/Dropdown';
import API from '../../../services/api';

const Skills = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { values, handleChange } = useForm({
        skill: '',
        level: '',
        yearsofexp: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/skill/create-skill",
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
        <div className="mr-4 space-y-10">
            <div className="bg-white shadow-lg rounded-2xl p-4">
                <form onSubmit={handleSubmit} method="post" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">


                        <DefaultInput
                            label="Enter Skill"
                            name="skill"
                            value={values.skill}
                            onChange={handleChange}
                            placeholder="JavaScript"
                            required
                        />


                        <Dropdown
                            label="Skill Level"
                            name="level"
                            onChange={handleChange}
                            required={true}
                            options={[
                                { label: "Beginner", value: "Beginner" },
                                { label: "Intermediate", value: "Intermediate" },
                                { label: "Expert", value: "Expert" },
                            ]}
                        />


                        <DefaultInput
                            label="Years of Experience"
                            name="yearsofexp"
                            value={values.yearsofexp}
                            onChange={handleChange}
                            placeholder="5"
                            type="number"
                            required
                        />

                    </div>

                    <div className="flex justify-end -mt-4">
                        <DefaultButton
                            type="submit"
                            label="Create New Skill"
                        />
                    </div>

                </form>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">All Skills</h1>
                <p className="text-gray-500">List of all employee skills will appear here.</p>
            </div>
        </div>
    );
};

export default Skills;

import React from 'react'
import Toast from '../../../component/Toast/Toast';
import { useEffect } from 'react';
import { useState } from 'react';
import API from '../../../services/api';
import useForm from '../../../hooks/useForm';
import DefaultInput from '../../../component/Form/DefaultInput';
import TextAreaInput from '../../../component/Form/TextAreaInput';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import AllPlans from './AllPlans';


const SkillGrowthPlan = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({
        aboutme: '',
    });

    const headleCreatePlan = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post(
                "/skill/genarate-skill-plan",
                values,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success === true) {
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
    }


    return (
        <div className="mr-4 space-y-10">
            <div className="fixed top-12 right-6 z-50">
                {toast && (
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-gray-500 py-4 pl-4">
                    Create Your Own unique Skill Growth Plan
                </h1>
                <p className="mb-4 text-gray-500">
                    <span className='uppercase text-red-500 font-bold'>Important: </span>
                    Please wait until your plan is generated. It may take some time depending on your input.
                </p>

                <form onSubmit={headleCreatePlan} method="post">
                    <div className="">
                        <TextAreaInput
                            label={"Say about your Current Skills and project and You already done, qulifications"}
                            name={'aboutme'}
                            value={values.aboutme}
                            onChange={handleChange}
                            required
                            placeholder='About you'
                        />

                        <div className="">
                            <DefaultButton
                                type='submit'
                                label={loading ? "Genarating Your Skill Growth Plan" : "Genarate Plan"}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-4">
                <AllPlans />
            </div>
        </div>
    )
}

export default SkillGrowthPlan
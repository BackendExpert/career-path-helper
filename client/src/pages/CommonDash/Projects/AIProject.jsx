import React, { useEffect, useState } from 'react'
import useForm from '../../../hooks/useForm'
import API from '../../../services/api'
import DefaultButton from '../../../component/Buttons/DefaultButton'

const AIProject = () => {
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(null)
    const [toast, setToast] = useState(null);

    const headleGenarateProject = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/project/genarate-ai-project', {}, {
                headers: { "Content-Type": "application/json" },
            });

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
    }

    return (
        <div>
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="mb-4 text-gray-500 ">
                    Using you Current Skills Genarate a Project
                </div>
                <form onSubmit={headleGenarateProject} method="post">
                    <div className="md:w-1/6">
                        <DefaultButton
                            type='submit'
                            label={loading ? 'Genarating Projects' : 'Genarate a Project'}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AIProject
import React, { useEffect, useState } from 'react';
import API from '../../../services/api';
import { FaCode, FaTrash } from "react-icons/fa";
import Toast from '../../../component/Toast/Toast';

const AllSkills = () => {
    const [allskills, setallskills] = useState([]);
    const token = localStorage.getItem('token');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchallskills = async () => {
            try {
                const res = await API.get(`/skill/get-all-skills?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setallskills(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchallskills();
    }, [token]);


    const handleDeleteSkill = async (skillid) => {
        try {
            const res = await API.delete(
                `/skill/delete-skill/${skillid}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setToast({ success: false, message: res.data.message });
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="fixed top-12 right-6 z-50">
                {toast && (
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
            <div className="grid md:grid-cols-4 gap-6">
                {allskills.map((data, index) => (
                    <div
                        key={index}
                        className="p-5 rounded-2xl bg-gray-50/70 backdrop-blur-sm border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
                    >

                        <button
                            onClick={() => handleDeleteSkill(data._id)}
                            className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition"
                        >
                            <FaTrash />
                        </button>

                        <div className="flex items-center">

                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 
                                    flex items-center justify-center shadow-md shadow-emerald-200/40
                                    ring-2 ring-white/40 hover:ring-emerald-200 transition">
                                    <FaCode className="text-white text-3xl drop-shadow-lg" />
                                </div>


                                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl scale-110"></div>
                            </div>


                            <div className="ml-5 space-y-1">
                                <h1 className="text-2xl font-semibold text-emerald-600 tracking-wide">
                                    {data.skill}
                                </h1>

                                <p className="text-gray-700 font-medium text-sm px-2 py-1 
                                    bg-gray-100 rounded-lg inline-block shadow-sm">
                                    Level: {data.level}
                                </p>

                                <p className="text-gray-900 font-semibold text-lg">
                                    {data.exp_years} <span className="text-gray-500 text-sm">years</span>
                                </p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllSkills;

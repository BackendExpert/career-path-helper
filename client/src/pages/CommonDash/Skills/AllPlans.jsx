import React, { useEffect, useState } from 'react'
import API from '../../../services/api'

const AllPlans = () => {
    const [allplans, setallplans] = useState([])
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchallplans = async () => {
            try {
                const res = await API.get(`/skill/get-skill-plans?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setallplans(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        }
        if (token) fetchallplans()
    }, [token])

    return (
        <div>
            <h1 className="mb-6 text-gray-700 font-bold text-2xl tracking-wide">
                My Skill Growth Plans
            </h1>

            <div className="space-y-4">
                {allplans.map((data, index) => {

                    const text = String(data.text || "");
                    const lines = text.split("\n");

                    let targetLine = lines.find(line => line.trim().startsWith("##"));
                    if (targetLine) targetLine = targetLine.replace(/^##\s*/, "");

                    return (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <div className="md:flex justify-between items-start">

                                {/* Left Section */}
                                <div className="space-y-1">
                                    <h2 className="text-gray-800 font-semibold text-lg">
                                        {targetLine || "No heading found"}
                                    </h2>

                                    <p className="text-gray-500 text-sm">
                                        <span className="font-medium text-gray-600">Prompt:</span> {data.promt}
                                    </p>

                                    <p className="text-gray-400 text-xs">
                                        Generated at:{" "}
                                        {new Date(data.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Right Section */}
                                <button className="md:mt-0 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm shadow-sm transition-all">
                                    View Plan
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>


    )
}

export default AllPlans
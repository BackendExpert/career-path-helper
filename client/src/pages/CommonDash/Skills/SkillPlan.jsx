import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../../services/api';
import DefaultButton from '../../../component/Buttons/DefaultButton';

const SkillPlan = () => {
    const { id } = useParams();
    const [skillplan, setSkillplan] = useState('');
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSkillplan = async () => {
            try {
                const res = await API.get(`/skill/get-one-plan/${id}?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSkillplan(res.data.result);
            } catch (err) {
                console.log(err);
            }
        };
        if (token) fetchSkillplan();
    }, [token]);

    const text = String(skillplan.text || "");
    const lines = text.split("\n");

    let targetLine = lines.find(line => line.trim().startsWith("##"));
    if (targetLine) targetLine = targetLine.replace(/^##\s*/, "");

    return (
        <div className="">
            {/* Back Button */}
            <div className="md:w-1/6 mb-6">
                <a href="/Dashboard/skills/plan">
                    <DefaultButton
                        type='button'
                        label='Back'
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                    />
                </a>
            </div>

            {/* Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                {/* Header */}
                <div className="mb-4 border-b border-gray-200 pb-3">
                    <h1 className="text-gray-800 font-bold text-2xl mb-1">{targetLine}</h1>
                    <p className="text-gray-500 text-sm">
                        Created At: {skillplan.createdAt ? new Date(skillplan.createdAt).toLocaleDateString() : "-"}
                    </p>
                </div>

                <div className="space-y-6">
                    {lines.map((line, i) => {
                        const headingMatch = line.match(/^(#{1,6})\s*(.*)/);
                        let contentLine = line;
                        let headingLevel = 0;

                        if (headingMatch) {
                            headingLevel = headingMatch[1].length; 
                            contentLine = headingMatch[2]; 
                        }

                        const parts = contentLine.split(/(\*\*.*?\*\*)/g);

                        return (
                            <div key={i} className={`transition-all duration-200`}>
                                {headingLevel > 0 ? (

                                    <h2
                                        className={`
                                            ${headingLevel === 1 ? "text-3xl text-blue-600 font-extrabold mb-3" : ""}
                                            ${headingLevel === 2 ? "text-2xl text-indigo-600 font-bold mb-2" : ""}
                                            ${headingLevel === 3 ? "text-xl text-purple-600 font-semibold mb-2" : ""}
                                            ${headingLevel > 3 ? "text-lg text-gray-800 font-semibold mb-1" : ""}
                                        `}
                                    >
                                        {parts.map((part, idx) => {
                                            if (/^\*\*(.*)\*\*$/.test(part)) {
                                                const boldText = part.replace(/\*\*/g, '');
                                                return (
                                                    <span key={idx} className="font-bold text-gray-900">
                                                        {boldText}
                                                    </span>
                                                );
                                            } else {
                                                return part.replace(/\*/g, '');
                                            }
                                        })}
                                    </h2>
                                ) : (
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        {parts.map((part, idx) => {
                                            if (/^\*\*(.*)\*\*$/.test(part)) {
                                                const boldText = part.replace(/\*\*/g, '');
                                                return (
                                                    <span key={idx} className="font-bold text-gray-900 bg-yellow-100 px-1 rounded">
                                                        {boldText}
                                                    </span>
                                                );
                                            } else {
                                                return part.replace(/\*/g, '');
                                            }
                                        })}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default SkillPlan;

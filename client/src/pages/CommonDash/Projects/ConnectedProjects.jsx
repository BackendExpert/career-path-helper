import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import { Code2, Star, Eye, User, Calendar, Globe } from "lucide-react";

const ConnectedProjects = () => {
    const [allConnectedProjects, setAllConnectedProjects] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchConnectedProjects = async () => {
            try {
                const res = await API.get(
                    `/project/get-connected-projects?nocache=${Date.now()}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAllConnectedProjects(res.data?.result || []);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchConnectedProjects();
    }, [token]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
                Connected Projects
            </h1>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allConnectedProjects.map((repo) => (
                    <div
                        key={repo.id}
                        className="
                            p-6 rounded-xl bg-white 
                            border border-gray-200 
                            shadow-sm hover:shadow-md 
                            transition duration-200
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Code2 size={20} className="text-gray-700" />
                                {repo.name}
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mt-1">
                            {repo.description || "No description available"}
                        </p>

                        {/* Owner */}
                        <div className="mt-5 flex items-center gap-3">
                            <img
                                src={repo.owner.avatar_url}
                                alt="owner"
                                className="w-11 h-11 rounded-full border border-gray-300"
                            />
                            <div>
                                <div className="font-medium text-gray-800 flex items-center gap-2">
                                    <User size={16} className="text-gray-700" />
                                    {repo.owner.login}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Owner ID: {repo.owner.id}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            <div className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                                <Star size={18} className="mx-auto text-gray-700" />
                                <p className="font-semibold text-gray-800">
                                    {repo.stargazers_count}
                                </p>
                                <p className="text-xs text-gray-500">Stars</p>
                            </div>

                            <div className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                                <Eye size={18} className="mx-auto text-gray-700" />
                                <p className="font-semibold text-gray-800">
                                    {repo.watchers_count}
                                </p>
                                <p className="text-xs text-gray-500">Watchers</p>
                            </div>

                            <div className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                                <Code2 size={18} className="mx-auto text-gray-700" />
                                <p className="font-semibold text-gray-800">
                                    {repo.language || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">Language</p>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="mt-6 space-y-2 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-600" />
                                <span>
                                    Created:{" "}
                                    <b>{new Date(repo.created_at).toLocaleDateString()}</b>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-600" />
                                <span>
                                    Updated:{" "}
                                    <b>{new Date(repo.updated_at).toLocaleDateString()}</b>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-gray-600" />
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    Open Repository
                                </a>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-5 pt-3 border-t border-gray-200">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                Default Branch: <b>{repo.default_branch}</b>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectedProjects;

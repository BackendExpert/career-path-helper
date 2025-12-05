import React, { useEffect, useState } from "react";
import API from "../../../services/api";

const SavedRepos = () => {
    const [savedrepos, setsavedrepos] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAllSavedRepos = async () => {
            try {
                const res = await API.get(`/github/savedrepos?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setsavedrepos(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchAllSavedRepos();
    }, [token]);

    return (
        <div className="p-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">

            </h2>

            {savedrepos.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                    No repositories saved yet.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {savedrepos.map((repo, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {repo.name || "Unnamed Repo"}
                            </h3>
                            {repo.description && (
                                <p className="text-gray-600 text-sm mb-4">{repo.description}</p>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Owner: {repo.owner?.login || repo.repo_owner}</span>
                                <span>⭐ {repo.stargazers_count || 0}</span>
                            </div>
                            <a
                                href={repo.html_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-500"
                            >
                                View on GitHub
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedRepos;

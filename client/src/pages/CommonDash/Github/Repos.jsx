import React, { useEffect, useState } from 'react';
import API from '../../../services/api';
import { GoRepoForked } from "react-icons/go";
import { FaUsersLine, FaUsersRays } from "react-icons/fa6";


const Repos = () => {
    const [githubprofile, setGithubProfile] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get(`/github/github-profile?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setGithubProfile(res.data.result);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const carddata = [
        {
            id: 1,
            name: "Repositories",
            count: githubprofile?.public_repos || 0,
            icon: <GoRepoForked size={40} />
        },
        {
            id: 2,
            name: "Followers",
            count: githubprofile?.followers || 0,
            icon: <FaUsersLine size={40} />
        },
        {
            id: 3,
            name: "Followings",
            count: githubprofile?.following || 0,
            icon: <FaUsersRays size={40} />
        }
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">

                <div className="md:w-5/12 text-gray-700 leading-relaxed text-sm space-y-6">

                    <div className="md:flex gap-6 items-center p-5 bg-white rounded-xl shadow-md border border-gray-100">

                        <img
                            src={githubprofile?.avatar_url}
                            alt=""
                            className="h-32 w-32 rounded-full shadow-md"
                        />
                        <div className="flex flex-col">

                            <h1 className="text-xl font-semibold text-gray-800">
                                {githubprofile?.login}
                                {githubprofile?.name && (
                                    <span className="text-gray-500"> ({githubprofile?.name})</span>
                                )}
                            </h1>

                            <a
                                href={githubprofile?.html_url}
                                target="_blank"
                                className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 
                           bg-clip-text text-transparent hover:underline"
                            >
                                View GitHub Profile →
                            </a>

                            <p className="mt-2 text-gray-600">Followers: {githubprofile?.followers}</p>
                            <p className="text-gray-600">Followings: {githubprofile?.following}</p>

                            <p className="mt-2 text-xs text-gray-500">
                                Joined: {githubprofile?.created_at ? new Date(githubprofile.created_at).toLocaleDateString() : ""}
                            </p>
                            <p className="text-xs text-gray-500">
                                Last Updated: {githubprofile?.updated_at ? new Date(githubprofile.updated_at).toLocaleDateString() : ""}
                            </p>

                        </div>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 space-y-3">

                        {githubprofile?.bio && (
                            <p className="text-gray-700 font-medium">{githubprofile.bio}</p>
                        )}

                        <p className="text-gray-600">
                            <span className="font-semibold text-gray-800">Company:</span> {githubprofile?.company || "N/A"}
                        </p>

                        {githubprofile?.blog && (
                            <a
                                href={githubprofile.blog}
                                target="_blank"
                                className="font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 
                           bg-clip-text text-transparent hover:underline"
                            >
                                Visit Blog →
                            </a>
                        )}

                        <p className="text-gray-600">
                            <span className="font-semibold text-gray-800">Location:</span> {githubprofile?.location || "N/A"}
                        </p>

                    </div>

                </div>


                {/* Right Section - Cards */}
                <div className="md:w-7/12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {carddata.map((data) => (
                            <div
                                key={data.id}
                                className="p-6 rounded-xl shadow-lg bg-white border border-gray-100
                                           hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Icon Circle */}
                                <div className="w-14 h-14 rounded-full flex items-center justify-center
                                                bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md">
                                    {data.icon}
                                </div>

                                {/* Text */}
                                <div className="mt-4">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {data.name}
                                    </div>
                                    <div className="text-3xl font-bold text-transparent bg-clip-text
                                                    bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
                                        {data.count}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Repos;

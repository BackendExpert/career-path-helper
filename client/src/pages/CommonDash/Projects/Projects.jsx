import React from 'react';
import { FaProjectDiagram } from 'react-icons/fa';
import { FaCheck, FaGithub } from 'react-icons/fa6';
import GithubProjects from './GithubProjects';
import API from '../../../services/api';
import { useState } from 'react';
import { useEffect } from 'react';
import ConnectedProjects from './ConnectedProjects';

const Projects = () => {
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

    const [allConnectedProjects, setAllConnectedProjects] = useState([]);

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

    const steps = [
        "This release only fetches projects from the user's GitHub profile.",
        "You must connect your GitHub profile to this system.",
        "Go to Settings → Account Settings → Accounts Information and provide your GitHub username.",
        "The system will fetch all your public repositories as projects.",
        "After that, you can select your project and continue."
    ];

    const projectconent = [
        {
            id: 1,
            name: "Github Repos",
            count: githubprofile.public_repos,
            icon: FaGithub,
        },
        {
            id: 2,
            name: "Connected Projects",
            count: allConnectedProjects.length,
            icon: FaProjectDiagram,
        },
    ]

    if (!githubprofile) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 rounded-xl text-center font-semibold">
                You are not connected with your GitHub profile.
            </div>
        );
    }

    return (
        <div className="">
            <div className="mt-0 mr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    {projectconent.map((data) => {
                        const Icon = data.icon;
                        return (
                            <div
                                key={data.id}
                                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md">
                                        <Icon className="text-white text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">{data.name}</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                                            {data.count}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mr-4">
                <GithubProjects />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mr-4 mt-4">
                <ConnectedProjects />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mr-4 mt-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">How to Connect GitHub Projects</h2>
                <ul className="space-y-3">
                    {steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <FaCheck className="text-emerald-500 mt-1" />
                            <p className="text-gray-700">{step}</p>
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
};

export default Projects;

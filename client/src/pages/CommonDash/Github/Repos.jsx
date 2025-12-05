import React, { useEffect, useState, useMemo } from 'react';
import API from '../../../services/api';
import { GoRepoForked } from "react-icons/go";
import { FaUsersLine, FaUsersRays } from "react-icons/fa6";
import DefaultInput from '../../../component/Form/DefaultInput';
import Dropdown from '../../../component/Form/Dropdown';

const PAGE_SIZE = 20;

const Repos = () => {
    const [githubprofile, setGithubProfile] = useState('');
    const [allrepos, setAllRepos] = useState([]);
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    useEffect(() => {
        const fetchAllRepos = async () => {
            try {
                const res = await API.get(`/github/github-repos?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllRepos(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        };
        if (token) fetchAllRepos();
    }, [token]);

    // Get unique languages for dropdown
    const languages = useMemo(() => {
        const langs = allrepos.map(r => r.language).filter(Boolean);
        return Array.from(new Set(langs));
    }, [allrepos]);

    // Filtered and searched repos
    const filteredRepos = useMemo(() => {
        return allrepos.filter(repo => {
            const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase());
            const matchesLang = !language || repo.language === language;
            return matchesSearch && matchesLang;
        });
    }, [allrepos, search, language]);

    // Pagination
    const totalPages = Math.ceil(filteredRepos.length / PAGE_SIZE);
    const paginatedRepos = filteredRepos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const carddata = [
        { id: 1, name: "Repositories", count: githubprofile?.public_repos || 0, icon: <GoRepoForked size={40} /> },
        { id: 2, name: "Followers", count: githubprofile?.followers || 0, icon: <FaUsersLine size={40} /> },
        { id: 3, name: "Followings", count: githubprofile?.following || 0, icon: <FaUsersRays size={40} /> }
    ];

    // Show message if GitHub profile not connected
    if (!githubprofile) {
        return (
            <div className="p-6 bg-yellow-100 text-yellow-800 rounded-xl text-center font-semibold">
                You are not connected with your GitHub profile.
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Left Section - Profile */}
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
                        {githubprofile?.bio && <p className="text-gray-700 font-medium">{githubprofile.bio}</p>}
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
                                <div className="w-14 h-14 rounded-full flex items-center justify-center
                                                bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md">
                                    {data.icon}
                                </div>
                                <div className="mt-4">
                                    <div className="text-lg font-semibold text-gray-800">{data.name}</div>
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

            {/* Search & Filter */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <DefaultInput
                    label="Search by Repo Name"
                    name="search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Enter repo name..."
                />

                <Dropdown
                    label="Filter by Language"
                    name="language"
                    value={language}
                    onChange={(e) => { setLanguage(e.target.value); setCurrentPage(1); }}
                    options={languages.map(lang => ({ value: lang, label: lang }))}
                />
            </div>

            {/* Repos Table */}
            <div className="mt-4">
                <div className="bg-white shadow-xl rounded-3xl p-4">
                    <table className="min-w-full text-left text-gray-700">
                        <thead className="hidden sm:table-header-group">
                            <tr className="text-gray-500 text-sm border-b border-gray-200">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Repo Name</th>
                                <th className="py-3 px-4">Size</th>
                                <th className="py-3 px-4">Main Language</th>
                                <th className="py-3 px-4">View Full</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRepos.map((repo, index) => (
                                <tr key={repo.id || index} className="hover:bg-gray-50 transition rounded-xl sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 p-4 sm:p-0">
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">{repo.name}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">{repo.size}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">{repo.language}</td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        <a href={repo.html_url} target="_blank" className="text-blue-500 hover:underline">
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded ${page === currentPage ? 'bg-emerald-400 text-white' : 'bg-gray-200'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Repos;

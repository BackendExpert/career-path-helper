import React, { useEffect, useState } from 'react';
import API from '../../../services/api';
import { BsFillGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import ArticalsSearch from './ArticalsSearch';

const Articles = () => {
    const token = localStorage.getItem('token');
    const [topArticles, setTopArticles] = useState([]);
    const [displayView, setDisplayView] = useState('grid');

    useEffect(() => {
        const fetchTopArticles = async () => {
            try {
                const res = await API.get(`/article/get-articles?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTopArticles(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        };
        if (token) fetchTopArticles();
    }, [token]);

    return (
        <div className='mr-4'>
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 p-5 rounded-2xl shadow-lg text-white mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-bold tracking-wider drop-shadow-sm">
                    Top Latest Articles
                </h1>
            </div>

            <div className="">
                <ArticalsSearch />
            </div>

            <div className="md:flex hidden justify-end mb-6">
                <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-sm">
                    {['grid', 'list'].map((view) => {
                        const isActive = displayView === view;
                        const Icon = view === 'grid' ? BsFillGridFill : FaList;
                        return (
                            <button
                                key={view}
                                onClick={() => setDisplayView(view)}
                                className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl mx-1 transition-all duration-300
                  ${isActive ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-xl scale-110' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
                                aria-label={`${view} view`}
                            >
                                <Icon className="h-6 w-6 md:h-7 md:w-7" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {displayView === 'grid' ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topArticles.map((data, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
                        >
                            {data.social_image && (
                                <img
                                    src={data.social_image}
                                    alt={data.title}
                                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                                />
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-gray-900 text-lg md:text-xl font-semibold mb-2 line-clamp-2">
                                    {data.title}
                                </h2>
                                <p className="text-gray-500 text-sm mb-2">
                                    By <span className="font-medium">{data.user.name}</span>
                                </p>
                                <div className="flex flex-wrap text-gray-500 text-sm gap-4 mb-2">
                                    <span>Language: {data.language}</span>
                                    <span>Reading Time: {data.reading_time_minutes} min</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm mb-3">
                                    <span>Comments: {data.comments_count}</span>
                                    <span>Reactions: {data.public_reactions_count}</span>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-3 mb-3">{data.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {data.tag_list.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gradient-to-r from-emerald-100 to-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        className="text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors duration-300"
                                    >
                                        Read Full Article
                                    </a>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(data.published_timestamp).toLocaleDateString()}{" "}
                                        {new Date(data.published_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {topArticles.map((data, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row gap-4"
                        >
                            {data.social_image && (
                                <img
                                    src={data.social_image}
                                    alt={data.title}
                                    className="w-full md:w-48 h-48 object-cover hover:scale-105 transition-transform duration-500 rounded-l-2xl"
                                />
                            )}
                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-gray-900 text-lg md:text-xl font-semibold mb-2 line-clamp-2">
                                    {data.title}
                                </h2>
                                <p className="text-gray-500 text-sm mb-2">
                                    By <span className="font-medium">{data.user.name}</span>
                                </p>
                                <div className="flex flex-wrap text-gray-500 text-sm gap-4 mb-2">
                                    <span>Language: {data.language}</span>
                                    <span>Reading Time: {data.reading_time_minutes} min</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm mb-3">
                                    <span>Comments: {data.comments_count}</span>
                                    <span>Reactions: {data.public_reactions_count}</span>
                                </div>
                                <p className="text-gray-700 text-sm line-clamp-3 mb-3">{data.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {data.tag_list.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gradient-to-r from-emerald-100 to-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        className="text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors duration-300"
                                    >
                                        Read Full Article
                                    </a>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(data.published_timestamp).toLocaleDateString()}{" "}
                                        {new Date(data.published_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Articles;

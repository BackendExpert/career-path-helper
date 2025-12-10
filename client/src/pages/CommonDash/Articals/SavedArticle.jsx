import React, { useEffect, useState } from 'react'
import API from '../../../services/api'
import { FaGithub, FaSpinner } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const SavedArticle = () => {
    const token = localStorage.getItem("token")
    const [savedArticles, setSavedArticles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSavedArticles = async () => {
            setLoading(true)
            try {
                const res = await API.get(`/article/saved-articles?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setSavedArticles(Array.isArray(res.data.result) ? res.data.result : [])
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        if (token) fetchSavedArticles()
    }, [token])

    return (
        <div className="mt-6 space-y-6 mr-4">
            <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-red-500">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-bold uppercase text-lg">Important</span>
                </div>
                <p className="text-gray-700 mb-2">
                    Articles are fetched from{' '}
                    <a
                        href="https://developers.forem.com/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 underline hover:text-cyan-800 transition"
                    >
                        dev.to API
                    </a>
                    .
                </p>
                <p className="text-gray-600">
                    Fetching may take some time, please wait until all saved articles are loaded.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10 space-x-2 text-gray-600">
                    <FaSpinner className="animate-spin text-2xl text-emerald-400" />
                    <span className="text-lg font-medium text-gray-700">Loading saved articles...</span>
                </div>
            ) : savedArticles.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-lg font-medium">
                    No saved articles found.
                </div>
            ) : (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                    {savedArticles.map((data, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                        >
                            {data.cover_image && (
                                <img src={data.cover_image} alt="" className="w-full h-48 object-cover" />
                            )}

                            <div className="p-4 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={data.user.profile_image}
                                        alt=""
                                        className="h-14 w-14 rounded-full border-2 border-gray-200"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-gray-800 font-semibold">{data.user.name}</p>
                                        <p className="text-gray-500 text-sm">@{data.user.username}</p>
                                        <div className="flex space-x-2 mt-1">
                                            {data.user.twitter_username && (
                                                <a
                                                    href={`https://x.com/${data.user.twitter_username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-400 hover:text-cyan-500"
                                                >
                                                    <FaXTwitter size={18} />
                                                </a>
                                            )}
                                            {data.user.github_username && (
                                                <a
                                                    href={`https://github.com/${data.user.github_username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-800 hover:text-gray-900"
                                                >
                                                    <FaGithub size={18} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <h1 className="text-gray-900 text-xl font-bold">{data.title}</h1>
                                {data.description && (
                                    <p className="text-gray-600 line-clamp-3">{data.description}</p>
                                )}

                                <div className="flex justify-between items-center mt-3">
                                    {data.user.website_url && (
                                        <a
                                            href={data.user.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 underline hover:text-cyan-500 text-sm"
                                        >
                                            View Profile
                                        </a>
                                    )}
                                    <a
                                        href={data.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
                                    >
                                        View Article
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SavedArticle

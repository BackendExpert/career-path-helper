import React, { useState } from "react";
import useForm from "../../../hooks/useForm";
import DefaultInput from "../../../component/Form/DefaultInput";
import DateInput from "../../../component/Form/DateInput";
import DefaultButton from "../../../component/Buttons/DefaultButton";
import Toast from "../../../component/Toast/Toast";
import API from "../../../services/api";

const SearchrepoContent = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [fetchedRepos, setFetchedRepos] = useState([]);

    const { values, handleChange } = useForm({
        reponame: "",
        language: "",
        filtersdate: "",
        filterenddate: "",
    });

    const fetchRepos = async () => {
        if (!token) {
            setToast({ success: false, message: "Token not found. Please login again." });
            return;
        }

        setLoading(true);

        const payload = {
            ...(values.reponame && { reponame: values.reponame }),
            ...(values.language && { language: values.language }),
            ...(values.filtersdate && { filtersdate: values.filtersdate }),
            ...(values.filterenddate && { filterenddate: values.filterenddate }),
            page: 1,
            per_page: 40,
        };

        try {
            const res = await API.post("/github/search-repo", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                const list = Array.isArray(res.data.result) ? res.data.result : [];
                setFetchedRepos(list.slice(0, 40));
            } else {
                setToast({ success: false, message: "Failed to fetch repositories" });
            }
        } catch (err) {
            const message = err.response?.data?.message || "Request failed. Please try again.";
            setToast({ success: false, message });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchRepos();
    };

    // const handleSaveRepo = async (repo) => {
    //     try {
    //         const res = await API.post("/github/save-repo", repo, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         setToast({ success: res.data.success, message: res.data.message });
    //     } catch (err) {
    //         setToast({
    //             success: false,
    //             message: err.response?.data?.message || "Failed to save repo",
    //         });
    //     }
    // };

    const handleSaveRepo = async (reponame) => {
        if (!reponame) {
            setToast({ success: false, message: "Repository name is missing" });
            return;
        }
        try {
            const res = await API.post(
                "/github/save-repo",
                { repo: reponame },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            const message =
                err.response?.data?.message || "Request failed. Please try again.";
            setToast({ success: false, message });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className=" space-y-8">
            {toast && <Toast success={toast.success} message={toast.message} />}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-200"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DefaultInput
                        label="Repository Name"
                        placeholder="express, react, nextjs"
                        name="reponame"
                        value={values.reponame}
                        required
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Language"
                        placeholder="javascript, python…"
                        name="language"
                        value={values.language}
                        onChange={handleChange}
                    />

                    <DateInput
                        label="Start Date"
                        name="filtersdate"
                        value={values.filtersdate}
                        onChange={handleChange}
                    />

                    <DateInput
                        label="End Date"
                        name="filterenddate"
                        value={values.filterenddate}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end">
                    <DefaultButton
                        type="submit"
                        label={loading ? "Searching..." : "Search Repositories"}
                    />
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {fetchedRepos.length > 0 ? (
                    fetchedRepos.map((repo, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-200"
                        >
                            <div className="font-semibold text-gray-900 text-xl">
                                {repo.name}
                            </div>

                            {repo.description && (
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                    {repo.description}
                                </p>
                            )}

                            <div className="text-gray-500 text-sm mt-3 flex items-center gap-3">
                                <span>⭐ {repo.stargazers_count}</span>
                                {repo.language && <span className="px-2 py-1 bg-gray-100 rounded-md">{repo.language}</span>}
                            </div>

                            <div className="flex justify-between mt-4">
                                {repo.html_url && (
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 text-sm underline"
                                    >
                                        View on GitHub
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleSaveRepo(repo.name)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                >
                                    Save Repo
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-gray-500 text-center text-sm">
                        No repositories found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchrepoContent;

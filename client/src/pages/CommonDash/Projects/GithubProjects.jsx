import React, { useEffect, useState, useMemo } from 'react';
import API from '../../../services/api';
import useForm from '../../../hooks/useForm';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import DefaultInput from '../../../component/Form/DefaultInput';
import Toast from '../../../component/Toast/Toast';

const GithubProjects = () => {
    const [allRepos, setAllRepos] = useState([]);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    const { values, handleChange } = useForm({
        selectedproject: '',
    });

    useEffect(() => {
        const fetchAllRepos = async () => {
            try {
                const res = await API.get(`/github/github-repos?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAllRepos(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                setToast({ success: false, message: "Failed to fetch GitHub projects." });
            }
        };
        if (token) fetchAllRepos();
    }, [token]);

    const filteredRepos = useMemo(() => {
        return allRepos.filter(repo =>
            repo.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [allRepos, search]);

    const handleSelectProject = (repoName) => {
        handleChange({ target: { name: 'selectedproject', value: repoName } });
        setSearch(repoName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!values.selectedproject) {
            setToast({ success: false, message: "Please select a project first!" });
            return;
        }

        setLoading(true);

        try {
            const res = await API.post(
                "/project/connect-project",
                { project_name: values.selectedproject },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setToast({ success: true, message: res.data.message });
                setTimeout(() => window.location.reload(), 2000);

            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            const message = err.response?.data?.message || "Request failed. Please try again.";
            setToast({ success: false, message });
            console.log(message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-4">
            {toast && (
                <Toast
                    success={toast.success}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <h1 className="text-lg font-semibold text-gray-700 mb-5">
                Select and Connect Project from GitHub
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <DefaultInput
                        label="Type to search projects"
                        name="selectedproject"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Start typing project name..."
                    />

                    {search && search !== values.selectedproject && filteredRepos.length > 0 && (
                        <ul className="mb-4 absolute z-10 w-full bg-white border border-gray-200 rounded-xl -mt-4 max-h-60 overflow-auto shadow-lg">
                            {filteredRepos.map((repo) => (
                                <li
                                    key={repo.id}
                                    onClick={() => handleSelectProject(repo.name)}
                                    className="px-4 py-2 hover:bg-emerald-100 cursor-pointer transition-colors duration-200"
                                >
                                    {repo.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4">
                    <DefaultButton
                        type="submit"
                        label={loading ? "Connecting..." : "Connect with Project"}
                        className="w-full"
                    />
                </div>
            </form>
        </div>
    );
};

export default GithubProjects;

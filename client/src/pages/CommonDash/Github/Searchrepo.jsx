import React, { useState } from "react";
import { FaBookmark, FaSearch } from "react-icons/fa";
import SearchrepoContent from "./SearchrepoContent";
import SavedRepos from "./SavedRepos";

const Searchrepo = () => {
    const [active, setActive] = useState(1);

    const repodata = [
        {
            id: 1,
            name: "Saved Repos",
            count: 40,
            icon: FaBookmark,
        },
    ];

    const accountsections = [
        {
            id: 1,
            name: "Search Repos",
            icon: FaSearch,
            content: <SearchrepoContent />,
        },
        {
            id: 2,
            name: "Saved Repos",
            icon: FaBookmark,
            content: <SavedRepos />,
        },
    ];

    return (
        <div className="space-y-6">

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {repodata.map((data) => {
                    const Icon = data.icon;
                    return (
                        <div
                            key={data.id}
                            className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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

            {/* Tabs */}
            <div className="bg-white rounded-3xl shadow-md p-3">
                <div className="flex flex-wrap gap-3 justify-start">
                    {accountsections.map((tab) => {
                        const Icon = tab.icon;
                        const activeTab = active === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActive(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium
                                    ${activeTab
                                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md scale-[1.03]"
                                        : "bg-white border border-gray-200 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <Icon className="text-lg" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                    {accountsections.find((x) => x.id === active)?.name}
                </h2>

                <div className="text-gray-600">
                    {accountsections.find((x) => x.id === active)?.content}
                </div>
            </div>
        </div>
    );
};

export default Searchrepo;

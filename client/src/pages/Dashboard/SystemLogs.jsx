import React, { useEffect, useState } from "react";
import API from "../../services/api";

const SystemLogs = () => {
    const [systemlogs, setSystemLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 20;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAllSystemLogs = async () => {
            try {
                const res = await API.get(`/admin/user-logs?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSystemLogs(Array.isArray(res.data.result) ? res.data.result : []);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchAllSystemLogs();
    }, [token]);

    // Filter by email inside description
    const filteredLogs = systemlogs.filter((item) =>
        item.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);

    const goToPage = (num) => {
        if (num >= 1 && num <= totalPages) setCurrentPage(num);
    };

    return (
        <div className="mt-6">
            <div className="bg-white shadow-xl rounded-3xl p-4">

                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1); // reset page on search
                        }}
                    />
                </div>

                <table className="min-w-full text-left text-gray-700">
                    <thead className="hidden sm:table-header-group">
                        <tr className="text-gray-500 text-sm border-b border-gray-200">
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Action</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">IP Address</th>
                            <th className="py-3 px-4">User Agent</th>
                            <th className="py-3 px-4">Timestamp</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentRecords.map((data, index) => (
                            <tr
                                key={data._id}
                                className="hover:bg-gray-50 transition rounded-xl sm:table-row 
                                flex flex-col sm:flex-row mb-4 sm:mb-0 p-4 sm:p-0"
                            >
                                <td className="py-2 px-2 sm:py-4 sm:px-4 font-semibold">
                                    {(currentPage - 1) * recordsPerPage + (index + 1)}
                                </td>

                                <td className="py-2 px-2 sm:py-4 sm:px-4 text-blue-500 font-semibold">
                                    {data.action || "-"}
                                </td>

                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    {data.description || "-"}
                                </td>

                                <td className="py-2 px-2 sm:py-4 sm:px-4 text-red-500 font-semibold">
                                    {data.ipAddress || data.metadata?.ipAddress || "-"}
                                </td>

                                <td className="py-2 px-2 sm:py-4 sm:px-4 break-words text-green-500 font-semibold">
                                    {data.userAgent || data.metadata?.userAgent || "-"}
                                </td>

                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                    {new Date(data.metadata?.timestamp || data.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-1 border rounded-lg ${currentPage === i + 1 ? "bg-gray-800 text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-lg disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;

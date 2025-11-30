import React, { useEffect, useState } from "react";
import {
    FaUser,
    FaUsers,
    FaEye,
    FaEdit,
    FaTrash,
    FaSearch,
} from "react-icons/fa";
import API from "../../../services/api";

const User = () => {
    const userdata = [
        { id: 1, name: "Total Users", value: 50, icon: FaUsers },
        { id: 2, name: "Total Admins", value: 5, icon: FaUser },
        { id: 3, name: "Total Interns/Undergraduate", value: 30, icon: FaUsers },
        { id: 4, name: "Total SE/SSE", value: 15, icon: FaUsers },
    ];

    const [allusers, setAllUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await API.get(`/admin/get-all-users?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                let users = Array.isArray(res.data.result) ? res.data.result : [];

                if (users.length < 20) {
                    for (let i = 1; i <= 25; i++) {
                        users.push({
                            email: `testuser${i}@example.com`,
                            username: `testuser${i}`,
                            role: { name: i % 2 === 0 ? "admin" : "user" },
                        });
                    }
                }

                setAllUsers(users);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchAllUsers();
    }, [token]);

    const filteredUsers = allusers.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="p-4">

            {/* -------------------------- Stats Cards -------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {userdata.map((data) => {
                    const Icon = data.icon;
                    return (
                        <div
                            key={data.id}
                            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md transform transition group-hover:scale-110">
                                    <Icon className="text-white text-2xl" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{data.name}</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                                        {data.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ----------------------- Search ----------------------- */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full sm:w-80">
                    <FaSearch className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by email or username..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* ----------------------- Table ----------------------- */}
            <div className="mt-6">
                <div className="bg-white shadow-xl rounded-3xl p-4">

                    <table className="min-w-full text-left text-gray-700">
                        <thead className="hidden sm:table-header-group">
                            <tr className="text-gray-500 text-sm border-b border-gray-200">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition rounded-xl sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 p-4 sm:p-0"
                                >
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </td>

                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium break-all">
                                        {user.email}
                                    </td>

                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {user.username}
                                    </td>

                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${user.role?.name === "admin"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-cyan-100 text-cyan-700"
                                                }`}
                                        >
                                            {user.role?.name}
                                        </span>
                                    </td>

                                    {/* Dropdown */}
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-right relative">
                                        <button
                                            onClick={() =>
                                                setMenuOpen(menuOpen === index ? null : index)
                                            }
                                            className="text-gray-500 hover:text-gray-800 text-xl"
                                        >
                                            •••
                                        </button>

                                        {menuOpen === index && (
                                            <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-2xl z-10">
                                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm">
                                                    <FaEye /> View
                                                </button>
                                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm">
                                                    <FaEdit /> Edit
                                                </button>
                                                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600">
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* ----------------------- Pagination ----------------------- */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    className="px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-100"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-4 py-2 rounded-lg shadow-sm transition ${currentPage === i + 1
                                ? "bg-cyan-500 text-white shadow-md"
                                : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    className="px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-100"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default User;

import React, { useState, useEffect, useRef } from "react";
import {
    FiArrowLeft,
    FiSearch,
    FiGrid,
    FiSettings,
    FiBell,
    FiMail,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import defultUser from "../../assets/user.png";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../../services/api";

const DashNav = () => {
    const { auth, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [MyProfileImage, setMyProfileImage] = useState([]);
    const dropdownRef = useRef(null);
    const token = localStorage.getItem("token");

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch profile image
    useEffect(() => {
        const fetchmyprofileimage = async () => {
            try {
                const res = await API.get(
                    `/member/get-myprofileimage?nocache=${Date.now()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                            Expires: "0",
                        },
                    }
                );
                setMyProfileImage(
                    Array.isArray(res.data.result) ? res.data.result : [res.data.result]
                );
            } catch {
                setMyProfileImage([]);
            }
        };
        fetchmyprofileimage();
    }, [token]);

    return (
        <motion.header
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full border-b border-gray-100 bg-white"
        >
            <div className="flex items-center justify-between px-4 lg:px-8 h-14">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full border border-gray-300 text-sm rounded-md pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <div className="absolute right-2 top-1.5 text-[10px] text-gray-400 border border-gray-300 px-1.5 rounded">
                            CTRL + /
                        </div>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="hidden md:flex items-center gap-4 text-gray-500">
                    <button className="hover:text-gray-700">
                        <FiGrid className="text-lg" />
                    </button>
                    <button className="hover:text-gray-700">
                        <FiSettings className="text-lg" />
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                    <button className="text-gray-500 hover:text-gray-700">
                        <FiMail className="text-lg" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                        <FiBell className="text-lg" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-8 h-8 rounded-full overflow-hidden "
                        >
                            <img
                                src={
                                    MyProfileImage[0]?.profileimg
                                        ? `${import.meta.env.VITE_APP_API_FILES}/uploads/${MyProfileImage[0].profileimg}`
                                        : defultUser
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-3"
                                >
                                    <div className="flex items-center gap-3 px-4 pb-3">
                                        <img
                                            src={
                                                MyProfileImage[0]?.profileimg
                                                    ? `${import.meta.env.VITE_APP_API_FILES}/uploads/${MyProfileImage[0].profileimg}`
                                                    : defultUser
                                            }
                                            alt="User"
                                            className="w-10 h-10 rounded-full "
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {auth?.user?.username || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {auth?.user?.email || "user@email.com"}
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="py-1 text-sm text-gray-600">
                                        <li>
                                            <Link
                                                to="/Dashboard/my-profile"
                                                className="block px-4 py-2 hover:bg-gray-50 transition"
                                            >
                                                My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition">
                                                Settings
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 transition"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default DashNav;

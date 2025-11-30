import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import defultUser from "../../assets/user.png";
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    CalendarCheck,
    Calendar,
    TrendingUp,
    ClipboardList,
} from "lucide-react";
import SecPartDash from "./SecPartDash";

const DashHome = () => {
    const { auth } = useAuth();
    const username = auth?.user?.username || "User";

    const stats = [
        {
            title: "Total Employees",
            value: "256",
            change: "+1.2%",
            up: true,
            color: "text-blue-600",
            icon: <Users className="w-5 h-5" />,
        },
        {
            title: "Present Today",
            value: "240",
            change: "+0.8%",
            up: true,
            color: "text-green-500",
            icon: <UserCheck className="w-5 h-5" />,
        },
        {
            title: "Absent Today",
            value: "16",
            change: "-2.1%",
            up: false,
            color: "text-red-500",
            icon: <UserX className="w-5 h-5" />,
        },
        {
            title: "Late Arrivals",
            value: "9",
            change: "+0.4%",
            up: false,
            color: "text-yellow-500",
            icon: <Clock className="w-5 h-5" />,
        },
        {
            title: "On Leave",
            value: "12",
            change: "-1.3%",
            up: false,
            color: "text-orange-500",
            icon: <CalendarCheck className="w-5 h-5" />,
        },
        {
            title: "Monthly Attendance Rate",
            value: "94.2%",
            change: "+1.5%",
            up: true,
            color: "text-purple-600",
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            title: "Pending Leave Requests",
            value: "5",
            change: "-0.5%",
            up: false,
            color: "text-cyan-600",
            icon: <ClipboardList className="w-5 h-5" />,
        },
        {
            title: "Working Days This Month",
            value: "22",
            change: "0%",
            up: true,
            color: "text-gray-700",
            icon: <Calendar className="w-5 h-5" />,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        / Dashboard / Attendance Management
                    </p>
                </div>
            </div>

            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-5 mt-6 flex flex-col md:flex-row items-center justify-between border border-gray-100"
            >
                <div className="flex items-center gap-4">
                    <img
                        src={defultUser}
                        alt="User"
                        className="h-16 w-16 rounded-full border border-gray-200"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Welcome Back, {username} 👋
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Attendance Management System Overview
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-6">
                {stats.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 ${card.color}`}
                            >
                                {card.icon}
                            </div>
                            <span
                                className={`text-xs font-medium ${card.up ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                
                            </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-gray-800">
                            {card.value}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{card.title}</p>
                    </motion.div>
                ))}
            </div>
            <div className="mt-8">
                <SecPartDash />
            </div>
        </div>
    );
};

export default DashHome;

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SecPartDash = () => {
    const attendanceData = [
        { name: "Present", value: 72 },
        { name: "Absent", value: 18 },
        { name: "Late", value: 10 },
    ];

    const COLORS = ["#7C3AED", "#F87171", "#FBBF24"]; // purple, red, yellow

    const clockList = [
        { name: "Adrian", in: "09:05 AM", out: "05:12 PM", status: "On Time" },
        { name: "Nimal", in: "09:25 AM", out: "–", status: "Late" },
        { name: "Sajith", in: "08:59 AM", out: "04:55 PM", status: "On Time" },
        { name: "Tharindu", in: "–", out: "–", status: "Absent" },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
            {/* Training / Intern */}
            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="border-b border-gray-100 p-4 font-semibold text-gray-800 text-lg">
                    Training / Intern
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center text-gray-600 mb-6">
                        <span className="text-sm font-medium">Total Members</span>
                        <span className="text-2xl font-bold text-gray-800">45</span>
                    </div>

                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <div className="border-b border-gray-100 p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                            <div>
                                <p className="text-sm text-gray-500">Interns</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">122</p>
                            </div>
                            <div className="text-sm text-green-600 font-semibold">+4.5%</div>
                        </div>

                        <div className="p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                            <div>
                                <p className="text-sm text-gray-500">Trainings</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">98</p>
                            </div>
                            <div className="text-sm text-red-500 font-semibold">-2.1%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Overview */}
            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="border-b border-gray-100 p-4 font-semibold text-gray-800 text-lg">
                    Attendance Overview
                </div>
                <div className="p-5 h-[280px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={attendanceData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                            >
                                {attendanceData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Clock-In/Out (Today) */}
            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="border-b border-gray-100 p-4 font-semibold text-gray-800 text-lg">
                    Clock-In/Out (Today)
                </div>
                <div className="p-5 ">
                    <div className="overflow-hidden border border-gray-100 rounded-lg">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-500">
                                    <th className="py-3 px-4 font-medium">Name</th>
                                    <th className="py-3 px-4 font-medium">In</th>
                                    <th className="py-3 px-4 font-medium">Out</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clockList.map((emp, i) => (
                                    <tr
                                        key={i}
                                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-gray-100 transition`}
                                    >
                                        <td className="py-3 px-4 text-gray-800 font-medium">
                                            {emp.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{emp.in}</td>
                                        <td className="py-3 px-4 text-gray-600">{emp.out}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.status === "On Time"
                                                    ? "bg-green-100 text-green-700"
                                                    : emp.status === "Late"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {emp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="">
                        <a href="">
                            <div className="bg-gray-100 w-full p-2 mt-4 text-center text-lg rounded-lg duration-500 hover:bg-purple-500 hover:text-white">
                                View More
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecPartDash;

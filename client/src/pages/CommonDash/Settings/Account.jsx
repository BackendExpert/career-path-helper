import React, { useEffect, useState } from "react";
import { FaGraduationCap, FaUserCog, FaUserLock, FaBriefcase, FaGithub, FaLinkedinIn, FaFacebook, FaGlobe } from "react-icons/fa";
import PersonalInfo from "./PersonalInfo";
import profileImg from "../../../assets/user.png"
import { useAuth } from "../../../context/AuthContext";
import Social from "./Social";
import APIConnected from "./APIConnected";
import { FaLink, FaX } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import Education from "./Education";
import Experience from "./Experience";
import API from "../../../services/api";


const Account = () => {
    const [active, setActive] = useState(1);
    const { auth } = useAuth()
    const token = localStorage.getItem('token')

    const accountsections = [
        {
            id: 1,
            name: "Personal Information",
            icon: FaUserCog,
            content: <PersonalInfo />
        },
        {
            id: 2,
            name: "Accounts Information",
            icon: IoShareSocial,
            content: <Social />
        },
        {
            id: 3,
            name: "Education",
            icon: FaGraduationCap,
            content: <Education />
        },
        {
            id: 4,
            name: "Experience",
            icon: FaBriefcase,
            content: <Experience />
        },
        {
            id: 5,
            name: "API Connected",
            icon: FaLink,
            content: <APIConnected />
        },
    ];

    const [memberdata, setmemberdata] = useState([])

    useEffect(() => {
        const fetchmemberdata = async () => {
            try {
                const res = await API.get(`/member/get-member-data?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setmemberdata(res.data.result);
            }
            catch (err) {
                console.log(err)
            }
        }

        if (token) fetchmemberdata()
    }, [token])


    return (
        <div className="p-4">
            <div className="md:flex bg-white shadow-xl rounded-2xl overflow-hidden">


                <div className="w-full md:w-1/4 border-r border-gray-200  ">
                    <div className="p-4">
                        {accountsections.map((data) => {
                            const Icon = data.icon;
                            return (
                                <div
                                    key={data.id}
                                    onClick={() => setActive(data.id)}
                                    className={`flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer transition-all
                                    ${active === data.id
                                            ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md scale-[1.02]"
                                            : "hover:bg-gray-100"
                                        }
                                `}
                                >
                                    <Icon className="text-lg" />
                                    <span className="font-medium">{data.name}</span>
                                </div>
                            );
                        })}
                    </div>


                    <div className="border-t border-gray-200 pb-12">
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={
                                            memberdata?.profileimage
                                                ? `${import.meta.env.VITE_APP_API_FILES}/uploads/${memberdata.profileimage}`
                                                : profileImg
                                        }
                                        alt="User"
                                        className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-gray-100"
                                    />

                                    <h2 className="mt-4 text-xl font-semibold uppercase tracking-wide text-gray-800">
                                        {memberdata?.fname} {memberdata?.lname}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {memberdata?.education?.[0]?.course || "No course added"}
                                    </p>

                                    <p className="text-gray-600 text-sm mt-1">
                                        {memberdata?.exp?.[0]?.job}{" "}
                                        <span className="text-blue-500 font-medium">
                                            {memberdata?.exp?.[0]?.workplace}
                                        </span>
                                    </p>

                                    <p className="text-gray-500 text-xs mt-1">
                                        {auth.user.email}
                                    </p>

                                    <p className="mt-3 text-sm text-gray-700 px-4 italic text-center">
                                        {memberdata?.shortbio}
                                    </p>

                                    <div className="mt-4">
                                        {memberdata.aiapi ? (
                                            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                                                ✓ AI API Connected
                                            </span>
                                        ) : (
                                            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 shadow-sm">
                                                ✗ AI API Not Connected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="flex justify-center gap-4 mt-4">
                                {memberdata.github && (
                                    <a
                                        href={`https://github.com/${memberdata.github}`}
                                        target="_blank"
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        <FaGithub className="h-6 w-6 text-gray-800" />
                                    </a>
                                )}

                                {memberdata.linkedin && (
                                    <a
                                        href={memberdata.linkedin}
                                        target="_blank"
                                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                                    >
                                        <FaLinkedinIn className="h-6 w-6 text-blue-700" />
                                    </a>
                                )}

                                {memberdata.twitter && (
                                    <a
                                        href={memberdata.twitter}
                                        target="_blank"
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        <FaX className="h-6 w-6 text-black" />
                                    </a>
                                )}

                                {memberdata.fb && (
                                    <a
                                        href={memberdata.fb}
                                        target="_blank"
                                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                                    >
                                        <FaFacebook className="h-6 w-6 text-blue-600" />
                                    </a>
                                )}

                                {memberdata.website && (
                                    <a
                                        href={memberdata.website}
                                        target="_blank"
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        <FaGlobe className="h-6 w-6 text-blue-500" />
                                    </a>
                                )}
                            </div>
                        </div>



                    </div>
                </div>

                <div className="w-full md:w-2/3 p-6 bg-white">
                    <h2 className="text-2xl font-semibold mb-4">
                        {accountsections.find((x) => x.id === active)?.name}
                    </h2>

                    <div className="text-gray-600 leading-relaxed">
                        {accountsections.find((x) => x.id === active)?.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;

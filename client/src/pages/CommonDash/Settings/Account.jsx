import React, { useState } from "react";
import { FaGraduationCap, FaUserCog, FaUserLock, FaBriefcase } from "react-icons/fa";
import PersonalInfo from "./PersonalInfo";
import profileImg from "../../../assets/user.png"
import { useAuth } from "../../../context/AuthContext";
import Social from "./Social";
import APIConnected from "./APIConnected";
import { FaLink } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import Education from "./Education";
import Experience from "./Experience";

const Account = () => {
    const [active, setActive] = useState(1);
    const { auth } = useAuth()

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
                        <center>
                            <img src={profileImg} alt="" className="h-40 w-auto" />
                            <div className="uppercase font-semibold">{auth.user.username}</div>
                            <div className="text-gray-500">{auth.user.email}</div>

                        </center>

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

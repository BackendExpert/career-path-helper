import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import defultUser from "../../assets/user.png";


const DashHome = () => {
    const { auth } = useAuth();
    const username = auth?.user?.username || "User";


    return (
        <div className="min-h-screen">
            {/* Header */}


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
                            Career AI Help
                        </p>
                    </div>
                </div>
            </motion.div>


        </div>
    );
};

export default DashHome;

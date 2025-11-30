import React from 'react';
import Logo from "../../assets/error-cake.png";

const DefultError = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">

            <img
                src={Logo}
                alt="Error Illustration"
                className="w-64 h-64 mb-8 animate-bounce"
            />

            <h1 className="text-8xl sm:text-9xl font-extrabold text-pink-700 mb-4 drop-shadow-lg">
                404
            </h1>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-wider text-pink-800 mb-2">
                Oops! Page Not Found
            </h2>

            <p className="text-pink-900 mb-8 max-w-md">
                The page you’re looking for doesn’t exist or may have been moved.
                Let’s get you back home safely.
            </p>

            <a href="/">
                <div className="inline-block py-3 px-10 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                    Go Back Home
                </div>
            </a>

        </div>
    );
};

export default DefultError;

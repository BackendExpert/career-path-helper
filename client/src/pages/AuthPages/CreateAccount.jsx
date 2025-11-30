import React, { useState } from 'react';
import SiteImage from '../../assets/siteimg.jpg';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import sitelogo from '../../assets/logo.png';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateAccount = () => {
    const navigate = useNavigate();
    const { handleEmailVerificationToken } = useAuth();
    const [Loading, setLoading] = useState(false);

    const { values, handleChange } = useForm({
        username: '',
        email: '',
        password: '',
    });

    const [toast, setToast] = useState(null);

    const headleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/registation', values, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data.success === true) {
                setToast({ success: true, message: res.data.message });
                handleEmailVerificationToken(res.data.token);
                setTimeout(() => navigate('/verify-account'), 2000);
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side */}
            <div className="relative hidden md:flex md:w-1/2">
                <img
                    src={SiteImage}
                    alt="ICT Center"
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="absolute bottom-10 left-10 text-white">
                    <img src={sitelogo} alt="" className='h-16 w-auto' />
                    <h2 className="text-3xl font-bold">BlackAlphaLabs PVT LTD</h2>
                    <p className="text-gray-200 max-w-sm">
                        Empowering innovation, technology, and learning excellence.
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-16 bg-white">

                {/* Toast */}
                <div className="absolute top-5 right-5 z-50">
                    {toast && (
                        <Toast
                            success={toast.success}
                            message={toast.message}
                            onClose={() => setToast(null)}
                        />
                    )}
                </div>

                <div className="w-full max-w-md">
                    <div className="md:hidden">
                        <center className='mb-4'>
                            <img src={sitelogo} alt="" className='h-16 w-auto' />
                            <h2 className="font-bold">BlackAlphaLabs</h2>
                        </center>
                    </div>

                    <h1 className="md:text-4xl font-bold text-gray-800 text-center mb-2">
                        Welcome to Employee Management System
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        Please log in to continue to your dashboard.
                    </p>

                    <form onSubmit={headleSubmit}>
                        <DefaultInput
                            label="Username"
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />

                        <DefaultInput
                            label="Email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                        <DefaultInput
                            label="Password"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                        <DefaultButton
                            type="submit"
                            disabled={Loading}
                            label={Loading ? "Creating..." : "Create New Account"}
                        />
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Already have an account?{' '}
                        <a href="/" className="text-[#560606] font-semibold hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;

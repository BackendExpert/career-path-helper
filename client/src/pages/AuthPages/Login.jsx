import React, { useState } from 'react';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import sitelogo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [Loading, setLoading] = useState(false);

    const { values, handleChange } = useForm({
        email: '',
        password: '',
    });

    const [toast, setToast] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/login', values);

            if (res.data.success === true) {
                setToast({ success: true, message: res.data.message });
                login(res.data.token);

                const decoded = jwtDecode(res.data.token);
                const role = decoded?.role;

                if (role === "admin" || role === "supervisor") {
                    setTimeout(() => navigate('/Dashboard'), 1500);
                } else if (role === "intern") {
                    setTimeout(() => navigate('/my-account'), 1500);
                } else if (role === "developer") {
                    setTimeout(() => navigate('/developer-dashboard'), 1500);
                } else {
                    setTimeout(() => navigate('/'), 1500);
                }
            } else {
                setToast({ success: false, message: res.data.message });
            }
        } catch (err) {
            const message =
                err.response?.data?.message || "Request failed. Please try again.";
            setToast({ success: false, message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            {toast && (
                <div className="absolute top-5 right-5 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-lg border border-gray-100">
                <div className="text-center mb-2">
                    <img src={sitelogo} alt="logo" className="h-20 rounded-lg w-auto mx-auto mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 p-4 " />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Log in to your account
                </p>

                <form onSubmit={handleLogin}>
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

                    <div className="flex justify-end mb-6">
                        <a href="/forget-password"
                            className="text-sm text-emerald-400 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <DefaultButton
                        label={Loading ? "Logging in..." : "Login"}
                        type="submit"
                    />
                </form>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Don’t have an account?{' '}
                    <a href="/create-account" className="text-emerald-400 font-semibold hover:underline">
                        Create one
                    </a>
                </p>
                <div className="mt-2 text-center text-xs text-gray-500">&copy; CareerAI Helper | { new Date().getFullYear() }</div>
            </div>

        </div>
    );
};

export default Login;

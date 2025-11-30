import React, { useState } from 'react';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import sitelogo from '../../assets/logo.png';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgetPassword = () => {
    const { handleEmailVerificationToken } = useAuth();
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { values, handleChange } = useForm({
        email: '',
    });

    const showToast = (success, message) => {
        setToast({ success, message });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/forget-password', values);

            if (res.data.success === true) {
                handleEmailVerificationToken(res.data.token);
                showToast(true, res.data.message);
                setTimeout(() => navigate('/verify-otp'), 2000);
            } else {
                showToast(false, res.data.message);
            }
        } catch (err) {
            const message =
                err.response?.data?.message || "Request failed. Please try again.";
            showToast(false, message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            {/* Toast */}
            {toast && (
                <div className="absolute top-5 right-5 z-50">
                    <Toast
                        success={toast.success}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            {/* Center Card */}
            <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-lg border border-gray-100">

                <div className="text-center mb-2">
                    <img
                        src={sitelogo}
                        alt="logo"
                        className="h-20 rounded-lg w-auto mx-auto mb-3
                        bg-gradient-to-r from-emerald-400 to-cyan-400 p-4"
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    Forget Password
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Enter your email to receive an OTP.
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

                    <DefaultButton
                        type="submit"
                        disabled={Loading}
                        label={Loading ? "Sending OTP..." : "Request Password Reset OTP"}
                    />
                </form>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Remember your password?{' '}
                    <a
                        href="/"
                        className="text-emerald-400 font-semibold hover:underline"
                    >
                        Sign In
                    </a>
                </p>

                <div className="mt-2 text-center text-xs text-gray-500">
                    &copy; CareerAI Helper | {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;

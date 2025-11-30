import React, { useEffect, useState } from 'react';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import sitelogo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const VerifyEmail = () => {
    const token = localStorage.getItem('emailverify');
    const navigate = useNavigate();
    const { verifyEmailInfo, handleEmailVerificationToken } = useAuth();

    const [toast, setToast] = useState(null);
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!verifyEmailInfo.email && token) {
            try {
                handleEmailVerificationToken(token);
            } catch {
                localStorage.clear();
                navigate('/');
            }
        }
    }, [verifyEmailInfo, token, handleEmailVerificationToken, navigate]);

    const { values, handleChange } = useForm({ otp: '' });

    const showToast = (success, message) => setToast({ success, message });

    const headleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/verify-email', values, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                showToast(true, res.data.message);
                setTimeout(() => {
                    navigate('/');
                    localStorage.removeItem('emailverify');
                }, 2000);
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
                    Verify Your Account
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Enter the OTP sent to your registered email to activate your account.
                </p>

                <form onSubmit={headleSubmit}>
                    <DefaultInput
                        label="One Time Password (OTP)"
                        type="text"
                        name="otp"
                        value={values.otp}
                        onChange={handleChange}
                        placeholder="Enter your OTP"
                        required
                    />

                    <DefaultButton
                        type="submit"
                        disabled={Loading}
                        label={Loading ? "Verifying..." : "Verify Account"}
                    />
                </form>

                <div className="mt-2 text-center text-xs text-gray-500">
                    &copy; CareerAI Helper | {new Date().getFullYear()}
                </div>

            </div>
        </div>
    );
};

export default VerifyEmail;

import React, { useEffect, useState } from 'react';
import SiteImage from '../../assets/siteimg.jpg';
import DefaultInput from '../../component/Form/DefaultInput';
import DefaultButton from '../../component/Buttons/DefaultButton';
import Toast from '../../component/Toast/Toast';
import useForm from '../../hooks/useForm';
import sitelogo from '../../assets/logo.png';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyOTP = () => {
    const token = localStorage.getItem('emailverify');
    const navigate = useNavigate();
    const { verifyEmailInfo, handleEmailVerificationToken } = useAuth();

    const [toast, setToast] = useState(null);
    const [Loading, setLoading] = useState(false);

    const { values, handleChange } = useForm({
        otp: '',
    });

    const showToast = (success, message) => {
        setToast({ success, message });
    };

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!verifyEmailInfo.email && token) {
            try {
                handleEmailVerificationToken(token);
            } catch (err) {
                localStorage.clear();
                navigate('/');
            }
        }
    }, [verifyEmailInfo, token, handleEmailVerificationToken, navigate]);

    const headleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/auth/verify-otp', values, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success === true) {
                showToast(true, res.data.message);
                setTimeout(() => navigate('/update-password'), 2000);
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
        <div className="min-h-screen flex flex-col md:flex-row">
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

            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 py-16 bg-white">
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

                    <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
                        Verify One Time Password
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        Verify your OTP (sent to your email when you requested password reset)
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
                            label={Loading ? "Verifying..." : "Verify OTP"}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;

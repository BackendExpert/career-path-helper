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

const UpdatePassword = () => {
    const token = localStorage.getItem('emailverify');
    const navigate = useNavigate();
    const { verifyEmailInfo, handleEmailVerificationToken } = useAuth();

    const [toast, setToast] = useState(null);
    const [Loading, setLoading] = useState(false);

    const { values, handleChange } = useForm({
        newpass: '',
        newpassword: '',
    });

    const showToast = (success, message) => setToast({ success, message });

    useEffect(() => {
        if (!token) navigate('/', { replace: true });
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

    const headleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (values.newpass !== values.newpassword) {
            showToast(false, "Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await API.post('/auth/update-password', values, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                showToast(true, res.data.message);
                setTimeout(() => navigate('/'), 2000);
                localStorage.clear();
            } else {
                showToast(false, res.data.message);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Request failed. Please try again.";
            showToast(false, message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="relative hidden md:flex md:w-1/2">
                <img src={SiteImage} alt="ICT Center" className="object-cover w-full h-full" />
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
                        Update Password
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        Update your password with a new one
                    </p>

                    <form onSubmit={headleSubmit}>
                        <DefaultInput
                            label="New Password"
                            type="password"
                            name="newpass"
                            value={values.newpass}
                            onChange={handleChange}
                            placeholder="Enter your new password"
                            required
                        />
                        <DefaultInput
                            label="Confirm New Password"
                            type="password"
                            name="newpassword"
                            value={values.newpassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                            required
                        />
                        <DefaultButton
                            type="submit"
                            disabled={Loading}
                            label={Loading ? "Updating..." : "Update Password"}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;

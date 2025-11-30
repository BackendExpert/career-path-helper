const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userotp.model")

// const logUserAction = require("../utils/others/logUserAction")
const logUserAction = require('../utils/others/logUserAction')

const tokenCreator = require("../utils/tokens/generateToken")
const sendEmail = require("../utils/email/emailTransporter")
const {
    RegistationResDTO,
    EmailVerifyResDTO,
    LoginResDTO,
    LogoutResDTO,
    ForgetPasswordResDTO,
    VerifyOTPResDTO,
    UpdatePasswordResDTO,
    updatePassviaDashResDTO
} = require("../dtos/auth.dto")

const PASSWORD_SULT = 10
const FRONTEND_URL = 'http://localhost:5173/login'

class AuthService {
    static async registation(username, email, password, req) {
        const existUser = await User.findOne({ email: email })

        if (existUser) {
            throw new Error("User Already Exist")
        }

        const hashPass = await bcrypt.hash(password, PASSWORD_SULT)

        const getstdrole = await Role.findOne({ name: 'intern' })

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            role: getstdrole._id,
        })

        const resultcreateuser = await newUser.save()

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "register", `${email} registered`, metadata, resultcreateuser._id);
        }

        const checkotp = await UserOTP.findOne({ email });
        if (checkotp) {
            throw new Error("User already requested OTP, please wait and try again later");
        }
        function generateOTP(length = 8) {
            return crypto
                .randomBytes(length)
                .toString("base64")
                .replace(/[^a-zA-Z0-9]/g, "")
                .slice(0, length);
        }

        const otp = generateOTP();

        await sendEmail({
            to: email,
            subject: "Welcome to CareerAI Helper",
            html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <div style="
                        background: linear-gradient(to right, #34d399, #22d3ee);
                        padding: 25px; 
                        text-align: center;
                    ">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">
                            Welcome to CareerAI Helper
                        </h1>
                        <p style="color: #e6fdfa; margin: 6px 0 0; font-size: 15px;">
                            Smarter Path to Your Career Growth
                        </p>
                    </div>

                    <!-- Body -->
                    <div style="padding: 35px; color: #333;">
                        <h2 style="font-size: 22px; margin-bottom: 12px; color: #374151;">Hello ${username},</h2>

                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #4b5563;">
                            Thank you for signing up with <strong>CareerAI Helper</strong>!  
                            To complete your registration, please verify your email using the OTP below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            font-size: 32px;
                            font-weight: 800;
                            letter-spacing: 6px;
                            color: #ffffff;
                            background: linear-gradient(to right, #34d399, #22d3ee);
                            padding: 18px;
                            text-align: center;
                            border-radius: 12px;
                            margin: 35px 0;
                        ">
                            ${otp}
                        </div>

                        <p style="font-size: 15px; color: #6b7280;">
                            ⏳ This code is valid for <strong>10 minutes</strong>.  
                            Please do not share your OTP with anyone.
                        </p>

                        <p style="font-size: 15px; color: #6b7280;">
                            If you didn’t create an account, just ignore this email.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

                        <p style="font-size: 15px; color: #475569;">
                            🎯 After verification, you can log in and start building your career profile using AI-powered tools.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                        <p style="margin: 5px 0;">© ${new Date().getFullYear()} CareerAI Helper</p>
                        <p style="margin: 0;">Empowering Your Future with AI</p>
                    </div>
                </div>
            </div>
            `,
        });


        const hashotp = await bcrypt.hash(otp, 10);
        const createotprecode = new UserOTP({
            email,
            otp: hashotp,
            createdAt: new Date(),
        });

        const resultcreateotp = await createotprecode.save();

        if (!resultcreateotp) {
            throw new Error("Error saving OTP");
        }

        const token = tokenCreator({ email, otp }, "15m");

        return RegistationResDTO(token)
    }

    static async verifyEmail(token, otpInput, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkotprecode = await UserOTP.findOne({ email: decoded.email });
        if (!checkotprecode) throw new Error("OTP Record Not found");

        const otpcheck = await bcrypt.compare(otpInput, checkotprecode.otp);
        if (!otpcheck) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Wrong_otp", `${user.email} Adding Wrong OTP when verifing Account`, metadata, user._id);

            throw new Error("OTP does not match");
        }

        const updateuser = await User.findOneAndUpdate(
            { email: decoded.email },
            { $set: { isEmailVerified: true } },
            { new: true }
        );

        if (updateuser) {
            await UserOTP.findOneAndDelete({ email: decoded.email });
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "account_verify", `${decoded.email} Accout Verified`, metadata, user._id);
            }
            return EmailVerifyResDTO()
        } else {
            throw new Error("Internal Server Error");
        }
    }

    static async login(email, password, req) {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("User does not exist by given Email Address");
        }

        const checkpass = await bcrypt.compare(password, user.password);

        if (!checkpass) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date(),
            };
            await logUserAction(req, "wrong_password", `${email} login failed`, metadata, user._id);
            throw new Error("Given Password does not match. Please check your password.");
        }

        if (!user.isEmailVerified) {
            throw new Error("Your email is not verified.");
        }

        if (!user.isActive) {
            throw new Error("Your account is not active.");
        }

        const getuserrole = await Role.findById(user.role);

        const token = tokenCreator(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: getuserrole?.name || "User",
            },
            "1d"
        );

        if (req) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date().toLocaleString(),
            };

            // ✅ Use `user` safely inside same scope
            await logUserAction(req, "login_success", `${user.email} Login Success`, metadata, user._id);

            // ✅ Define FRONTEND_URL or fallback
            const FRONTEND_URL = process.env.FRONTEND_URL;

            await sendEmail({
                to: email,
                subject: "Login Successful | Career AI Helper",
                html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: #301934; padding: 25px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 800;">Login Successful ✅</h1>
                <p style="color: #d1c4e9; margin: 6px 0 0; font-size: 15px;">
                    Career AI Helper
                </p>
            </div>

            <!-- Body -->
            <div style="padding: 35px; color: #333;">
                <h2 style="font-size: 22px; margin-bottom: 12px; color: #301934;">Hello ${user.username},</h2>

                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #4b5563;">
                    👋 You’ve successfully logged into <strong>Career AI Helper</strong>. 
                    If this was you, everything is fine. Otherwise, please review your account security immediately.
                </p>

                <div style="
                    background: linear-gradient(to right, #10b981, #06b6d4);
                    color: #ffffff;
                    border-radius: 12px;
                    padding: 18px 22px;
                    margin: 25px 0;
                ">
                    <h3 style="margin: 0 0 12px; font-size: 18px;">🔍 Login Details</h3>
                    <p style="margin: 4px 0; font-size: 15px;"><strong>📅 Time:</strong> ${metadata.timestamp}</p>
                    <p style="margin: 4px 0; font-size: 15px;"><strong>💻 Device:</strong> ${metadata.userAgent}</p>
                    <p style="margin: 4px 0; font-size: 15px;"><strong>🌐 IP Address:</strong> ${metadata.ipAddress}</p>
                </div>

                <p style="font-size: 15px; color: #6b7280;">
                    🔒 Keep your account secure and avoid sharing your login credentials with anyone.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

                <p style="font-size: 15px; color: #475569;">
                    💼 You can now continue managing employee data and system operations securely.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Career AI Helper</p>
                <p style="margin: 0;">Empowering Smart Workforce Management</p>
            </div>
        </div>
    </div>
    `,
            });




        }

        return LoginResDTO(token, user);
    }

    static async logout(token, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const metadata = {
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            timestamp: new Date(),
        };

        await logUserAction(req, "logout", `User ${user.email} logged out`, metadata, user._id);

        return LogoutResDTO()
    }

    static async ForgetPassword(email, req) {
        const existinguser = await User.findOne({ email: email })

        if (!existinguser) {
            throw new Error("User cannot found you given Email Address")
        }

        if (existinguser.isEmailVerified === false) {
            throw new Error("Your email is not Verify...")
        }

        if (existinguser.isActive === false) {
            throw new Error("Your Account is not Active...")
        }

        const checkotp = await UserOTP.findOne({ email });
        if (checkotp) {
            throw new Error("User already requested OTP, please wait and try again later");
        }

        function generateOTP(length = 8) {
            return crypto
                .randomBytes(length)
                .toString("base64")
                .replace(/[^a-zA-Z0-9]/g, "")
                .slice(0, length);
        }

        const otp = generateOTP();

        await sendEmail({
            to: email,
            subject: "Password Reset Request | Career AI Helper",
            html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: #301934; padding: 28px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800;">
                    Career AI Helper
                </h1>
                <p style="color: #d1c4e9; margin: 6px 0 0; font-size: 15px;">
                    Secure Password Reset
                </p>
            </div>

            <!-- Body -->
            <div style="padding: 35px; color: #333;">
                <h2 style="font-size: 22px; margin-bottom: 12px; color: #301934;">
                    Hello ${existinguser.username},
                </h2>

                <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #4b5563;">
                    We received a request to reset your password for <strong>Career AI Helper</strong>. 
                    Please use the OTP below to securely continue:
                </p>

                <div style="
                    font-size: 32px; 
                    font-weight: 800; 
                    letter-spacing: 6px; 
                    color: #fff; 
                    background: linear-gradient(to right, #10b981, #06b6d4); 
                    padding: 20px; 
                    text-align: center; 
                    border-radius: 12px; 
                    margin: 35px 0;
                ">
                    ${otp}
                </div>

                <p style="font-size: 15px; color: #6b7280;">
                    ⏳ This OTP is valid for <strong>10 minutes</strong>. Keep it safe and do not share it with anyone.
                </p>

                <p style="font-size: 15px; color: #6b7280;">
                    If you didn’t request a password reset, please ignore this message.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;" />
                
                <p style="font-size: 15px; color: #475569;">
                    💼 Once verified, you can securely set a new password and regain access to your Career AI Helper account.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 22px; text-align: center; font-size: 13px; color: #9ca3af;">
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Career AI Helper</p>
                <p style="margin: 0;">Empowering Smart Workforce Management</p>
            </div>
        </div>
    </div>
    `,
        });



        const hashotp = await bcrypt.hash(otp, 10);
        const createotprecode = new UserOTP({
            email,
            otp: hashotp,
            createdAt: new Date(),
        });

        const resultcreateotp = await createotprecode.save();
        if (!resultcreateotp) {
            throw new Error("Error saving OTP");
        }

        const token = tokenCreator({ email, otp }, "15m");

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Request Password Reset OTP", `${existinguser.email} requested Password Reset OTP and Sent to email Success `, metadata, existinguser._id);
        }

        return ForgetPasswordResDTO(token)
    }


    static async CheckandVerifyOTP(token, otp, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkotprecode = await UserOTP.findOne({ email: decoded.email });
        if (!checkotprecode) throw new Error("OTP Record Not found");

        const otpcheck = await bcrypt.compare(otp, checkotprecode.otp);

        if (!otpcheck) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Wrong_otp", `${user.email} Adding Wrong OTP when verifing Password Reset`, metadata, user._id);

            throw new Error("OTP does not match");
        }

        await UserOTP.findOneAndDelete({ email: decoded.email });
        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "OTP_verify_success", `${decoded.email} OTP Verification Success`, metadata, user._id);
        }

        return VerifyOTPResDTO()
    }


    static async UpdatePassword(token, newpassword, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");


        const hashpass = await bcrypt.hash(newpassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email: decoded.email },
            { $set: { password: hashpass } },
            { new: true }
        );

        if (updatedUser) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "password_Updated", `${decoded.email} Password Updated Success`, metadata, user._id);

                const FRONTEND_URL = process.env.FRONTEND_URL;
                await sendEmail({
                    to: user.email,
                    subject: "✅ Password Updated Successfully | Career AI Helper",
                    html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="
                background: linear-gradient(to right, #10b981, #06b6d4);
                padding: 28px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800;">
                    Career AI Helper
                </h1>
                <p style="color: #d1c4e9; margin: 6px 0 0; font-size: 15px;">Password Update Confirmation</p>
            </div>

            <!-- Body -->
            <div style="padding: 35px; color: #333; text-align: center;">
                <div style="font-size: 50px; color: #301934; margin-bottom: 10px;">🔐</div>
                <h2 style="font-size: 22px; margin-bottom: 12px; color: #301934;">Password Updated Successfully</h2>

                <p style="font-size: 16px; line-height: 1.7; margin-bottom: 25px; color: #4b5563;">
                    Hello <strong>${user.username}</strong>,<br>
                    Your password for your <strong>Career AI Helper</strong> account has been updated successfully.  
                    You can now log in using your new password.
                </p>

                <a href='${FRONTEND_URL}/login' 
                    style="
                        display: inline-block; 
                        padding: 14px 26px; 
                        background: linear-gradient(to right, #10b981, #06b6d4);
                        color: #fff; 
                        font-size: 15px; 
                        font-weight: 600; 
                        text-decoration: none; 
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(16,185,129,0.3);
                        transition: background 0.3s;">
                    🔑 Go to Login
                </a>

                <p style="font-size: 15px; color: #6b7280; margin-top: 30px;">
                    If you didn’t make this change, please reset your password immediately or contact the support team.
                </p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;" />
                
                <p style="font-size: 15px; color: #475569;">
                    💼 Access your Career AI Helper account securely anytime.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 22px; text-align: center; font-size: 13px; color: #9ca3af;">
                <p style="margin: 5px 0;">© ${new Date().getFullYear()} Career AI Helper</p>
                <p style="margin: 0;">Empowering Smart Workforce Management</p>
            </div>
        </div>
    </div>
    `,
                });


            }
            return UpdatePasswordResDTO()
        }
    }

    static async updatePasswordViaDash(token, currentpass, newpass, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkpass = await bcrypt.compare(user.password, currentpass)

        if (!checkpass) {
            throw new Error("Current Password not Match,...")
        }

        const hashnewpass = await bcrypt.hash(newpass, 10)

        const updatepassword = await User.findByIdAndUpdate(
            user._id,
            { $set: { password: hashnewpass } },
            { new: true }
        );

        if (updatepassword) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "password_updated_via_dashboard", `${decoded.email} Password Updated Success via Dashboard`, metadata, user._id);
            }

            return updatePassviaDashResDTO()
        }
    }

}

module.exports = AuthService
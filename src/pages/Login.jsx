import { Link, useNavigate } from "react-router-dom"
import Input from "../components/Ui/Input"
import { useEffect, useState } from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { assignUser } from "../redux/slices/authReducer";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

function Login() {
    const { signIn, isLoaded } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { user } = useUser();
    const { user: userData } = useSelector((state) => state.authReducer);
    const navigate = useNavigate();
    const {signOut} = useAuth();

    useEffect(()=>{
        if(userData)
        {
            return navigate("/feed");
        }
    },[userData])

    useEffect(() => {
        if (user && !userData) {
            login(user.emailAddresses[0].emailAddress)
        }
    }, [])

    const login = async (email) => {
        console.log("login")
        try {
            if (email) {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/login`, { email, password }, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.data) {
                    const { success, data, message } = await response.data;
                    if (success) {
                        dispatch(assignUser(data));
                    }
                    else {
                        toast.error(message);
                        await signOut();
                    }
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
            await signOut();
        }
    }

    const handleGoogleSignin = async () => {
        if (!isLoaded) return;

        try {
            console.log("start")
            const attempt = await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/signin",
                redirectUrlComplete: "/signin",
            });

            if (attempt.status === "complete") {
                login(attempt?.identifier);

            } else {
                console.log("Additional steps required:", attempt);
            }
        } catch (err) {
            console.log(err);
            navigate("/signin");
            setError(err.errors ? err.errors[0].message : "Hii");
        }
    };

    const handleMicrosoftSignin = async () => {
        if (!isLoaded) return;

        try {
            const attempt = await signIn.authenticateWithRedirect({
                strategy: "oauth_microsoft",
                redirectUrl: "/signin",
                redirectUrlComplete: "/signin",
            });

            if (attempt.status === "complete") {
                login(attempt);

            } else {
                console.log("Additional steps required:", attempt);
            }

        } catch (err) {
            setError(err.errors ? err.errors[0].message : "Failed to sign in with Microsoft");
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        try {
            const attempt = await signIn.create({
                identifier: email,
                password
            });

            console.log(attempt);
            console.log("Login successful:", attempt);

            if (attempt.status === "complete") {
                login(attempt);
            } else {
                console.log("Additional steps required:", attempt);
            }
        } catch (err) {
            if (err.message.includes("verification strategy is not valid")) {
                setError("This account requires social login or email verification.");
            } else {
                setError("Invalid email or password.");
            }
        }
    };

    return (
        <div className="bg-[#866f55] bg-opacity-10 w-screen h-screen flex flex-col justify-start p-2">
            <div className="flex justify-between py-4">
                <div className="px-12">
                    <Link className='flex gap-1 justify-center items-center font-bold text-[#0a66c2] text-4xl'>Linked<img src="/logo.png" alt="LinkedIn" className="w-9 h-9" /></Link>
                </div>
                <div></div>
            </div>
            <div className="mt-10">
                <div className="flex flex-col items-center justify-center min-h-full">
                    <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
                        <div className="mb-4 text-start">
                            <h1 className="text-2xl font-bold text-gray-800">Sign in</h1>
                            <p className="text-sm text-gray-600">Stay updated on your professional world.</p>
                        </div>
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <Input label="Email" value={email} setvalue={setEmail} type="email" placeholder="you@example.com" />
                            <Input label="Password" value={password} setvalue={setPassword} type="password" placeholder="Enter a Password" />
                            <Link className="font-semibold text-[#0a66c2]">Forgot password?</Link>
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-[#0a66c2] text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                            >
                                Agree & Join
                            </button>
                        </form>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">or</span>
                            </div>
                        </div>
                        <p className="break-words text-sm text-center mt-2 px-4">By clicking Continue to join or sign in, you agree to LinkedIn’s <span className="text-[#0a66c2] font-semibold">User Agreement, Privacy Policy,</span> and <span className="text-[#0a66c2] font-semibold">Cookie Policy.</span></p>
                        <button type="button" onClick={handleGoogleSignin} className="flex w-full mt-4 gap-1 justify-center items-center py-2 text-left border rounded-full hover:bg-gray-100 font-medium">
                            <img src="/google.webp" className="w-6 h-6" alt="icon" />
                            Continue With Google
                        </button>
                        <button type="button" onClick={handleMicrosoftSignin} className="flex w-full mt-4 gap-2 justify-center items-center py-2 text-left border rounded-full hover:bg-gray-100 font-medium">
                            <img src="/microsoft.png" className="w-6 h-6" alt="icon" />
                            Continue With Microsoft
                        </button>
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                New to LinkedIn?{" "}
                                <a href="/signup" className="text-blue-500 hover:underline">
                                    Join now
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
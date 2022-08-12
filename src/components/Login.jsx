import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsernames, loginUser } from "../firebase-config";
import { setLoggedIn, setTaken } from "../slices/userSlice";

export default function Login() {
    const { takenUsernames, loggedIn, username } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [valid, ] = useState(
        emailError === null && passwordError === null
    );

    const handleClick = async () => {
        if (!valid) return;
        const response = await loginUser(email, password);
        if (response !== null) {
            let id;
            Object.keys(takenUsernames).forEach(key => {
                if (takenUsernames[key].email === email) {
                    id = key;
                }
            })
            dispatch(setLoggedIn());
            navigate(`/users/${id}`);
        };
    }

    useEffect(() => {
        if (loggedIn) navigate(`users/${username}`);
        fetchUsernames()
        .then(data => {
            // console.log(data.forEach((doc) => console.log(`${doc.id} => ${doc.data()}`)));
            const existing = {};
            data.forEach((doc) => {
                const key = doc.id;
                existing[key] = doc.data();
            });
            // console.log(existing);
            dispatch(setTaken(existing));
        });
        // eslint-disable-next-line
    }, [])

    return (
        <div className="container-all" >
            {takenUsernames === null && <div className="loading">Loading...</div>}
            {takenUsernames !== null && (
                <div className="container-card">
                    <div className="header">User Review Login</div>
                    <div className="input-div">
                        <label htmlFor="email" className="login-label">
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            className={
                                emailError === null
                                    ? "login-input normal"
                                    : "login-input error"
                            }
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                            onBlur={() => {
                                const match = email.match(
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                );
                                if (match === null) {
                                    setEmailError("Email is invalid.");
                                } else {
                                    setEmailError(null);
                                }
                            }}
                        />
                        {emailError !== null && (
                            <div className="error-message">{emailError}</div>
                        )}
                    </div>

                    <div className="input-div">
                        <label htmlFor="password" className="login-label">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={
                                passwordError === null
                                    ? "login-input normal"
                                    : "login-input error"
                            }
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            onBlur={() => {
                                if (password.length < 4) {
                                    setPasswordError(
                                        "Password should be at least 4 characters long."
                                    );
                                } else {
                                    setPasswordError(null);
                                }
                            }}
                        />
                        {passwordError !== null && (
                            <div className="error-message">{passwordError}</div>
                        )}
                    </div>
                    <button className="login-button" onClick={() => handleClick()}>Login</button>
                    <div
                        className="signup-link"
                        onClick={() => navigate("/signup")}
                    >
                        No account yet? Signup here
                    </div>
                </div>
            )}
        </div>
    );
}

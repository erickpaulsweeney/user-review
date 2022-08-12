import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser, saveNewUser } from "../firebase-config";
import { setLoggedIn, setUser } from "../slices/userSlice";

export default function Signup() {
    const { takenUsernames } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmError, setConfirmError] = useState(null);
    const [valid, ] = useState(
        usernameError === null &&
            emailError === null &&
            passwordError === null &&
            confirmError === null
    );

    const handleClick = async () => {
        if (!valid) return;
        const response = await createUser(email, password);
        const saving = await saveNewUser(username, email);
        if (response !== null && saving !== null) {
            dispatch(setUser({ username: username, email: email, feedbacks: [] }));
            dispatch(setLoggedIn());
            navigate(`/users/${username}`)
        };
    }

    return (
        <div className="container-all">
            <div className="container-card">
                <div className="input-div">
                    <div className="header">User Review Signup</div>
                    <label htmlFor="username" className="login-label">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        className={
                            usernameError === null
                                ? "login-input normal"
                                : "login-input error"
                        }
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        onBlur={() => {
                            if (username.length < 4) {
                                setUsernameError(
                                    "Username should be at least 4 characters long."
                                );
                            } else if (Object.keys(takenUsernames).includes(username)) {
                                setUsernameError("Username already exists.");
                            } else {
                                setUsernameError(null);
                            }
                        }}
                    />
                    {usernameError !== null && <div className="error-message">{usernameError}</div>}
                </div>

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
                    {emailError !== null && <div className="error-message">{emailError}</div>}
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
                            if (password.length < 6) {
                                setPasswordError(
                                    "Password should be at least 6 characters long."
                                );
                            } else {
                                setPasswordError(null);
                            }
                        }}
                    />
                    {passwordError !== null && <div className="error-message">{passwordError}</div>}
                </div>

                <div className="input-div">
                    <label htmlFor="confirm" className="login-label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirm"
                        className={
                            confirmError === null
                                ? "login-input normal"
                                : "login-input error"
                        }
                        value={confirm}
                        onChange={(ev) => setConfirm(ev.target.value)}
                        onBlur={() => {
                            if (confirm !== password) {
                                setConfirmError("Passwords do not match.");
                            } else {
                                setConfirmError(null);
                            }
                        }}
                    />
                    {confirmError !== null && <div className="error-message">{confirmError}</div>}
                </div>

                <button className="login-button" disabled={!valid} onClick={() => handleClick()}>
                    Signup
                </button>

                <div className="signup-link" onClick={() => navigate("/")}>Already have an account? Login here</div>
            </div>
        </div>
    );
}

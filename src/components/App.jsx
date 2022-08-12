import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Signup from "./Signup";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/users/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    
    return (
        <div className="container-all">
            <div className="container-card">
                <div className="lost-div" onClick={() => navigate("/")}>
                    You seem to be lost. Click here to log in.
                </div>
            </div>
        </div>
    );
}

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux/es/exports";
import {
    fetchUserData,
    fetchUsernames,
    logoutUser,
    removeFeedbacks,
    updateFeedbacks,
} from "../firebase-config";
import {
    setFeedbacks,
    setLoggedOut,
    setTaken,
    setUser,
} from "../slices/userSlice";
import { useState } from "react";

export default function Profile() {
    const { username } = useParams();
    const { email, feedbacks, loggedIn, takenUsernames } = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [review, setReview] = useState("");
    const exists = takenUsernames
        ? Object.keys(takenUsernames).includes(username)
        : false;

    const handleClick = async () => {
        dispatch(setLoggedOut());
        const response = await logoutUser();
        if (response) navigate("/");
    };

    const handleSend = async () => {
        console.log(feedbacks);
        if (feedbacks === null) {
            console.log("test");
            const newList = [review];
            dispatch(setFeedbacks(newList));
            const response = await updateFeedbacks(username, newList);
            if (response) {
                alert("Review sent successfully!");
                setReview("");
            } else {
                alert("There seems to be a problem. Please try again.");
            }
        } else {
            let newList = JSON.parse(JSON.stringify(feedbacks));
            newList.push(review);
            dispatch(setFeedbacks(newList));
            const response = await updateFeedbacks(username, newList);
            if (response) {
                alert("Review sent successfully!");
                setReview("");
            } else {
                alert("There seems to be a problem. Please try again.");
            }
        }
    };

    const handleDelete = async (input) => {
        let newList = JSON.parse(JSON.stringify(feedbacks));
        newList = newList.filter((el) => el !== input);
        dispatch(setFeedbacks(newList));
        const response = await removeFeedbacks(username, input);
        if (response) {
            alert("Review deleted successfully!");
            setReview("");
        } else {
            alert("There seems to be a problem. Please try again.");
        }
    };

    useEffect(() => {
        fetchUsernames().then((data) => {
            // console.log(data.forEach((doc) => console.log(`${doc.id} => ${doc.data()}`)));
            const existing = {};
            data.forEach((doc) => {
                const key = doc.id;
                existing[key] = doc.data();
            });
            // console.log(existing);
            dispatch(setTaken(existing));
        });
        if (exists) {
            fetchUserData(username).then((data) => {
                dispatch(
                    setUser({
                        username: username,
                        email: data.email,
                        feedbacks: data.feedbacks || [],
                    })
                );
            });
        }
        // eslint-disable-next-line
    }, [takenUsernames]);

    return (
        <div className="container-all">
            {!exists && (
                <div className="container-card">
                    <div className="lost-div" onClick={() => navigate("/")}>
                        No user found. Click here to log in
                    </div>
                </div>
            )}
            {exists && !loggedIn && (
                <div className="container-card">
                    <img
                        src={`https://avatars.dicebear.com/api/micah/${username}.svg`}
                        className="user-photo"
                        alt=""
                    />
                    <div className="user-name">{username}</div>
                    <textarea
                        name="review"
                        cols="30"
                        rows="10"
                        className="review-input"
                        value={review}
                        onChange={(ev) => setReview(ev.target.value)}
                        placeholder="Leave a nice user review :)"
                    ></textarea>
                    <button
                        className="send-button"
                        disabled={review.length === 0}
                        onClick={() => handleSend()}
                    >
                        Send
                    </button>
                </div>
            )}
            {exists && loggedIn && (
                <div className="container-card">
                    {feedbacks === null && (
                        <div className="loading">Loading...</div>
                    )}
                    {feedbacks !== null && (
                        <>
                            <img
                                src={`https://avatars.dicebear.com/api/micah/${username}.svg`}
                                className="user-photo"
                                alt=""
                            />
                            <div className="user-name">{username}</div>
                            <div className="user-email">{email}</div>
                            {(!feedbacks || feedbacks.length === 0) && (
                                <div className="empty-feedback">
                                    Invite others by sharing your profile link!
                                </div>
                            )}
                            {feedbacks && feedbacks.length > 0 && (
                                <>
                                    <div className="your-reviews">
                                        Your reviews
                                    </div>
                                    {feedbacks.map((el) => (
                                        <div className="review-card" key={el}>
                                            {el}
                                            <button
                                                className="delete-review"
                                                onClick={() => handleDelete(el)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </>
                            )}
                            <button
                                className="logout-button"
                                onClick={() => handleClick()}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

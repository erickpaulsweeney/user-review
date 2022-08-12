import { createSlice } from "@reduxjs/toolkit";

const userData = localStorage.getItem("user-review") !== null ? JSON.parse(localStorage.getItem("user-review")) : null;

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: userData !== null ? userData?.username : null,
        email: userData !== null ? userData?.email : null,
        feedbacks: userData !== null ? userData?.feedbacks : null,
        takenUsernames: userData !== null ? userData?.takenUsernames : null,
        loggedIn: userData !== null ? userData?.loggedIn : false,
    },
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.feedbacks = action.payload.feedbacks;
            localStorage.setItem(
                "user-review",
                JSON.stringify({
                    ...state,
                    username: action.payload.username,
                    email: action.payload.email,
                    feedbacks: action.payload.feedbacks,
                })
            );
        },
        setTaken: (state, action) => {
            state.takenUsernames = action.payload;
            localStorage.setItem(
                "user-review",
                JSON.stringify({ takenUsernames: action.payload })
            );
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = true;
            localStorage.setItem(
                "user-review",
                JSON.stringify({ ...state, loggedIn: action.payload })
            );
        },
        setLoggedOut: (state) => {
            state.loggedIn = false;
            state.username = null;
            state.email = null;
            state.feedbacks = null;
            localStorage.clear();
        }, 
        setFeedbacks: (state, action) => {
            state.feedbacks = action.payload;
            localStorage.setItem(
                "user-review",
                JSON.stringify({ ...state, feedbacks: action.payload })
            );
        }
    },
});

export const { setUser, setTaken, setLoggedIn, setLoggedOut, setFeedbacks } = userSlice.actions;
export default userSlice.reducer;

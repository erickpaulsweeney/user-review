import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, setDoc, getDoc, getDocs, getFirestore, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyBCq_aXtv5Ze0tMa_hXMPa3DtxaB5wiENU",
    authDomain: "user-review-d9b86.firebaseapp.com",
    projectId: "user-review-d9b86",
    storageBucket: "user-review-d9b86.appspot.com",
    messagingSenderId: "235965644274",
    appId: "1:235965644274:web:c5e256f641bc6c2745ff6b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export const db = getFirestore(app);

export const fetchUsernames = async () => {
    try {
        const response = await getDocs(collection(db, "users")); 
        return response;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage, errorCode);
        return null;
    }
}

export const saveNewUser = async (id, email) => {
    try {
        await setDoc(doc(db, "users", id), {
            email: email
        });
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage, errorCode);
        return null;
    }
}

export const fetchUserData = async (id) => {
    try {
        const userRef = doc(db, "users", id);
        const response = await getDoc(userRef);
        return response.data();
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorCode, errorMessage);
        return null;
    }
}

export const updateFeedbacks = async (id, review) => {
    try {
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, {
            feedbacks: arrayUnion(...review)
        });
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorCode, errorMessage);
        return null;
    }
}

export const removeFeedbacks = async (id, review) => {
    try {
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, {
            feedbacks: arrayRemove(review)
        });
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorCode, errorMessage);
        return null;
    }
}

export const createUser = async (email, password) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password); 
        const user = response.user;
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage, errorCode);
        return null;
    }
}

export const loginUser = async (email, password) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password); 
        const user = response.user;
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage, errorCode);
        return null;
    }
}

export const logoutUser = async () => {
    try {
        await signOut(auth);
        alert('Logout successful.');
        return true;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage, errorCode);
        return null;
    }
}
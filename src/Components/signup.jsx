import "./signup.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../firebaseConfig";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      setSuccess("Account created successfully! You can now log in.");
    } catch (error) {
      setError(error.message);
    }
  };
  // const handleLogout = async () => {
  //   try {
  //     await auth.signOut();
  //     setSuccess("Logged out successfully!");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  // console.log(auth?.currentUser?.email);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="User Name"
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button className="submit-button" type="submit">Sign Up</button>
          {/* <button onClick={handleLogout}>Logout</button> */}
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default SignUp;
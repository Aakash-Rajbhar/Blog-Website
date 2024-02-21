import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {BASE_URL} from '../helper.js'

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const register = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      alert("Registration Successfull ");
      setRedirect(true);
    } else {
      alert("Failed to Register !!");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="container">
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />

        <input
          type={show ? "text" : "password"}
          id="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <label
          type="button"
          className="my-2"
          htmlFor="password"
          onClick={handleShow}
          style={{ cursor: "pointer" }}
        >
          {show ? "Hide" : "Show"}
        </label>
        <button>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <p>
          </p>
          <div className="p7">
          <span className="neong">Do you have an account?</span>
          </div>
          <div className="p8">
          <Link to="/login">
            <button className="button">Login</button>
          </Link>
          </div>
        </div>
        <div className="right">
          <div className="p6">
          <h1></h1>
          <form>
            <input
              type="text"
              placeholder="Gamertag"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            <button className="button" onClick={handleClick}>Register</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

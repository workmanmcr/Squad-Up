import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }

  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1></h1>
          <div className="p4">
          <span className="neong">Register</span>
          </div>
          <div className="p5">
          <Link to="/register">
            <button className="button">Register</button>
          </Link>
          </div> 
        </div>
        <div className="right">
          <div className="p3">
          <h1 className="neong">Login</h1>
          </div>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button className="button" onClick={handleLogin}>Ready Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

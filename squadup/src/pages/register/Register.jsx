import "./register.scss"
import { Link } from "react-router-dom";
const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <div className="left">
        <span>do you have an account?</span>
        <Link to="/login">
        <button>Login</button>
        </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Gamer tag" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Full name" />
            
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
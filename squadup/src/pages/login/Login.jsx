import "./login.scss"
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="left">
        <h1></h1>
        <p>please login so you can start gaming with you squad</p>
        <span>Don't have an account?</span>
        <Link to="/register">
        <button>register</button>
        </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Gamer tag" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
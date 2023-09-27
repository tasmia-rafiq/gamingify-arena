import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      
      //we want to save the cookie (from index.js, jwt cookie) into our react app
      credentials: 'include',
    });
    if(response.ok) {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
          setRedirect(true);
        });
    } else {
      alert('Wrong Credentials.');
    }
  }

  if(redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="login" onSubmit={login}>
        <h1 className="head_title blue_gradient">Login</h1>
        <input type="text" name="username" placeholder="Username"
        value={username}
        onChange={ev => setUsername(ev.target.value)} />
        <input type="password" name="password" placeholder="Password"
        value={password}
        onChange={ev => setPassword(ev.target.value)} />
        <button>Login</button>
    </form>
  )
}

export default LoginPage
import { useState } from "react"
import { useNavigate } from "react-router";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function register(ev) {
        ev.preventDefault();

        //since this is async function, we will add await
        const response = await fetch('https://gamingify-arena-api.vercel.app/api/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
        });

        if (response.status === 200) {
          alert('Registration Successful, you can now login to your account!');
          navigate('/login');
        } else {
          alert(' Registration Failed.')
        }
    }
    return (
      <form className="register" onSubmit={register}>
        <h1 className="head_title blue_gradient">Register</h1>
          <input type="text" 
                name="username"
                placeholder="Username" 
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
          <input type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
          <button>Register</button>
      </form>
    )
  }
  
  export default RegisterPage
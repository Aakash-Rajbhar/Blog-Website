import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };
  
  async function login(ev) {
    ev.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      
        if (response.ok) {
          const userInfo = await response.json();
          setUserInfo(userInfo);
          setRedirect(true);
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
      }
      
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type={show ? "text" : "password"}
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <label type="button" className="my-2" htmlFor="password" onClick={handleShow} style={{cursor:'pointer'}} >
              {show ? "Hide" : "Show"}
            </label>       
      <button>Login</button>
    </form>
  );
}
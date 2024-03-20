import { useState } from 'react';
import { auth } from '../lib/firebase';
import { message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            message.success('Login Success');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            message.error("Login Failed!");
        });
        
    }

    return (
       <div className="flex justify-center items-center h-screen" style={{ backgroundImage: "url('./bg.jpeg')"}}>
              <div className="w-1/3 space-y-4">
                <h1 className="text-5xl font-bold text-center m-5">Login</h1>
                <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleLogin}>Login</button>
              </div>
        </div>
    )
}
import { useState, useEffect } from 'react'
import { auth } from './lib/firebase'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'


function App() {
  const [user , setUser] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user){
        setUser(user);
      }
      setUser(user);
    })
  },[]);

  return (
    <>
      {user ? (
        <Dashboard />
      ) : (
       <Login />
      )  
      }
    </>
  )
}

export default App

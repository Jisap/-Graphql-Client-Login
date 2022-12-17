import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom"


const Homepage = () => {

  const { user, logout } = useContext( AuthContext );

  return (
    <>
        <div>
            <h1>This is the homepage</h1>
            {
              user ? 
                <>
                  <h2>{ user.email } esta logueado</h2>
                </>
              :
                <>
                  <h2>No hay datos de usuario logueado</h2>
                </>
            }
        </div>
    </>
  )
}

export default Homepage
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";

import { TextField, Button, Container, Stack, Alert } from "@mui/material";

import { gql } from "graphql-tag";
import { useNavigate } from 'react-router-dom';

const LOGIN_USER = gql`
    mutation login( $loginInput: LoginInput ){
        loginUser( loginInput: $loginInput ){
            email
            username
            token
        }
    }
`

function Login( props ) {
    let navigate = useNavigate()
    const context = useContext( AuthContext );  // User, login, logout
    const [errors, setErrors] = useState([]);

    const loginUserCallback = () => {
        loginUser()
    }

    const { onChange, onSubmit, values } = useForm( loginUserCallback, { // Valores del formulario de login
        email: '',
        password: '',
    })

    const [loginUser, { loading }] = useMutation( LOGIN_USER, {
        
        variables: { loginInput: values},                             // Datos del formulario

        update( proxy, { data: { loginUser : userData }}){            // actualizamos la cache de apollo con la data recibida del formulario
            context.login( userData )                                 // Establecemos el estado del usuario como logueado
            navigate('/');
        }, error({ graphQLErrors}){
            setErrors( graphQLErrors )
        },
    } )

    return (
    <Container spacing={2} maxWidth="sm">
      <h3>Login</h3>
      <p>This is the login page, login below</p>
      <Stack spacing={2} paddingBottom={2}>
        
        <TextField
          label="Email"
          name="email"
          onChange={ onChange }
        />
        <TextField
          label="Password"
          name="password"
          onChange={ onChange }
        />
        
      </Stack>
      { errors.map(function(error){
        return(
          <Alert serverity='error'>
            { error.message }
          </Alert>
        )
      })}
      <Button variant="contained" onClick={ onSubmit }>Login</Button>
    </Container>
  )
}

export default Login
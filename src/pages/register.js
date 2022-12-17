import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";

import { TextField, Button, Container, Stack, Alert } from "@mui/material";

import { gql } from "graphql-tag";
import { useNavigate } from 'react-router-dom';

// Esta es la definición de la mutation para registro de usuarios
// typeDefs del server define nuestra mutation: registerUser( registerInput: RegisterInput )
const REGISTER_USER = gql`
    mutation Mutation( $registerInput: RegisterInput ){ 
        registerUser(registerInput: $registerInput){    
            email
            username
            token
        }
    }
`

function Register( props ) {

  const context = useContext(AuthContext);  // User, login, logout
  let navigate = useNavigate()
  const [errors, setErrors] = useState([])

  const registerUserCallback = () => {      // Cuando usamos el submit
    console.log("Callback hit");
    registerUser()                          // se llama a la mutation registerUser
  }


  const { onChange, onSubmit, values } = useForm( registerUserCallback, { // Valores del formulario de registro
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // datos del nuevo usuario                     // Mutation usada
  const [registerUser, { loading }] = useMutation( REGISTER_USER,{
    
    variables: { registerInput: values},                  // Datos del formulario

    update( proxy, { data: { registerUser : userData }}){ // actualizamos la cache de apollo con la data recibida del formulario
        context.login( userData )                         // Establecemos el estado del usuario como logueado
        navigate('/');
    }, error({ graphQLErrors}){
      setErrors( graphQLErrors )
    }, 
  } ) 

  return (
    <Container spacing={2} maxWidth="sm">
      <h3>Register</h3>
      <p>This is the register page, register below to crate an account</p>
      <Stack spacing={2} paddingBottom={2}>
        <TextField
          label="Username"
          name="username"
          onChange={ onChange }
        />
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
        <TextField
          label="Confirm password"
          name="confirmPassword"
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
      <Button variant="contained" onClick={ onSubmit }>Register</Button>
    </Container>
  )

}

export default Register;


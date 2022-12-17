import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

//Estado inicial del usuario
const initialState = {
    user: null
}

// Verificación del estado del token (consecuencias)
if( localStorage.getItem('token')) {
    const decodedToken = jwtDecode(localStorage.getItem('token'));

    if(decodedToken.exp * 1000 < Date.now()){   // Si la fecha de expiración es anterior a la actual el token a caducado
        localStorage.removeItem('token');       // se borra del localStorage
    }else{                                      // Sino tenemos un token válido no caducado
        initialState.user = decodedToken;       // y establecemos el estado inicial del usuario con la info de ese token.
    }
}

// Context (info del user + methods) 
const AuthContext = createContext({             // Creamos el context de nuestra app
    user: null,                                 // Estado del user
    login: (userData) => {},                    // Métodos para modificar ese estado
    logout: () => {}
})

// Función reducer para establecer el estado del usuario
const authReducer = (state, action) => {
    switch( action.type ){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

const AuthProvider = ( props ) => {
    const[state,dispatch] = useReducer( authReducer, initialState); // Establece el state de user con el initialState, dispatch modificará ese estado
                                                                    // a traves del authReducer
    const login = (userData) => {                                   // Función de logueo
        localStorage.setItem( "token", userData.token );            // Establece el token en localStorage
        dispatch({                                                  // Modifica el estado del usuario con la data recibida ( userData )
            type: 'LOGIN',
            payload: userData
        });
    }

    const logout = () => {                                          // Función de logout
        localStorage.removeItem("token");                           // Borra el token del localStorage
        dispatch({ type: 'LOGOUT' });                               // Modifica el estado del usuario a null
    }

    return ( 
        <AuthContext.Provider                                       // Proveedor de estado del usuario
            value={{ user: state.user, login, logout }}             // user el que sea o null y sus métodos para modificarlo
            {...props}
        />    
    )
}

export { AuthContext, AuthProvider }
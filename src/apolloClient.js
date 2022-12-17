import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ // httpLink es un enlace a nuestro server GraphQL
    uri: "http://localhost:5000/"
});

const authLink = setContext((_, { headers }) => {                   // Generamos un context para todo el client basado en los headers del httplink
    return {
        headers: {                                                  // En la información que trae la url (headers)
            ...headers,                                             // spread de toda la info que contenga y ademas
            authorization: localStorage.getItem("token") || ""      // establecemos el token de autenticación
        }
    }                                                               
});

const client = new ApolloClient({           // Generamos un nuevo ApolloClient (gestiona peticiones y resp de graphQL)
    link: authLink.concat(httpLink),        // basado en una conexión a nuestro server graphQL y un context asociado a el.
    cache: new InMemoryCache()              // Creamos también una cache que usará nuestro client para su funcionamiento.
});

export default client;
import { ApolloClient } from 'apollo-client';
import {createUploadLink} from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const uploadLink = createUploadLink({
    uri: 'http://localhost:2000/'
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache()
});
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Include the token in the authorization header if it exists
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // Create an in-memory cache for caching GraphQL query results
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Navbar /> {/* Render the Navbar component */}
          <Routes>
            <Route path='/' element={<SearchBooks />} /> {/* Render the SearchBooks component for the root path */}
            <Route path='/saved' element={<SavedBooks />} /> {/* Render the SavedBooks component for the '/saved' path */}
            <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} /> {/* Render a 'Wrong page!' message for any other unmatched paths */}
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
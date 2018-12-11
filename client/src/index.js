import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

import App from './components/App';

const client = new ApolloClient({
  uri: 'http://localhost:4050/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: (operation) => {
    const token = localStorage.getItem('rlbtoken');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network error', networkError);
      if (networkError.status === 401) {
        localStorage.removeItem('rlbtoken');
      }
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
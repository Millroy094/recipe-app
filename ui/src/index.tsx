import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

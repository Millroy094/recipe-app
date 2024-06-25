import { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
} from "@apollo/client";

import Home from "./pages/Home/Home";
import MoreInfo from "./pages/MoreInfo/MoreInfo";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_API_URL,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

const App: FC<{}> = () => {
  return (
    <ApolloProvider client={client}>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<MoreInfo />} />
          </Routes>
        </Router>
      </div>
    </ApolloProvider>
  );
};

export default App;

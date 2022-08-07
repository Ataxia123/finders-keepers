import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const APIURL = "https://api.lens.dev";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const httpLink = new HttpLink({ uri: "https://api.lens.dev/" });

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const token = localStorage.getItem("auth_token");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <BrowserRouter>
        <App subgraphUri={subgraphUri} />
      </BrowserRouter>
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);

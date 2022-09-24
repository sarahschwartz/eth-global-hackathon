// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const lensAPIHttpLink = new HttpLink({ uri: "https://api-mumbai.lens.dev/" });
const unlockSubgraphHttpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/unlock-protocol/mumbai",
});

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const token = localStorage.getItem("lens_auth_token");
  console.log("token", token);

  // Use the setContext method to set the HTTP headers.
  if (token !== "undefined") {
    operation.setContext({
      headers: {
        "x-access-token": `Bearer ${token}`,
      },
    });
  }

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "unlock-subgraph",
    unlockSubgraphHttpLink, // <= apollo will send to this if clientName is "unlock-subgraph"
    authLink.concat(lensAPIHttpLink) // <= otherwise will send to this
  ),
  cache: new InMemoryCache(),
});

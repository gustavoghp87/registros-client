import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-boost';


const wsLink = new WebSocketLink({
  uri: `ws://localhost:4006/graphql`,
  options: {
    reconnect: true,
  }
})

export const apolloClientWS = () => new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
})

console.log(apolloClientWS)

// funciona pero hace cortocircuito con la otra conexión
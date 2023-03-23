import { GraphQLClient } from "graphql-request";

// export const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
export const client = new GraphQLClient(
  "http://graphql-engine:8080/v1/graphql",
  {
    headers: {
      "x-hasura-admin-secret":
        "HbRRpNuyNWDT1zulH063KklD6bLZpVTsL4Ojf1VY6kRfJInGqAisVuuhUO2lrJln",
    },
  }
);

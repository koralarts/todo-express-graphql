"use-strict";

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';

dotenv.config();

import { typeDefs, userSchema, taskSchema } from './schemas';
import { User } from './types/user';

import { verifyJWT } from './utils/jwt';

const PORT = 3000;

(async function() {
  const server = new ApolloServer({
    context({ req }) {
      const token = req.headers?.authorization || '';

      if (!token) {
        return null;
      }

      const data = verifyJWT(token);
      const me: User | undefined = userSchema.allUsers.find(user => user._id === data?._id);

      return { me }
    },
    typeDefs: [typeDefs, taskSchema.typedefs, userSchema.typeDefs],
    resolvers: [taskSchema.resolvers, userSchema.resolvers]
  });
  await server.start();

  const app = express()

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });

  return { server, app };
})();

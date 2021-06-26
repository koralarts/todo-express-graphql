"use-strict";

import { ApolloServer } from 'apollo-server';

import { typeDefs } from './schemas';
import * as task from './schemas/task';
import * as user from './schemas/user';
import { User } from './types/user';

import { JWTPayload, verifyJWT } from './utils/jwt';

const PORT = 3000;

const app = new ApolloServer({
  context({ req }) {
    const token = req.headers?.authorization || '';

    if (!token) {
      return null;
    }

    const data = verifyJWT(token);
    const me: User | undefined = user.allUsers.find(user => user._id === data?._id);

    return { me }
  },
  typeDefs: [typeDefs, task.typedefs, user.typeDefs],
  resolvers: [task.resolvers, user.resolvers]
});

app.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

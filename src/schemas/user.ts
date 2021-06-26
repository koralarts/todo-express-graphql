import { DocumentNode } from 'graphql';
import { gql } from 'apollo-server';
import { v4 as uuidV4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import bcrypt from 'bcrypt';

import { generateJWT } from '../utils/jwt';
import { User, UserCreate, UserUpdate, UserLogin } from '../types/user';

const SALT_ROUNDS = 10;

export const allUsers: User[] = [];

export const typeDefs: DocumentNode = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    tasks: [Task]
    token: String
  }

  extend type Query {
    me: User
    user(_id: String!): User
    users: [User]
  }

  extend type Mutation {
    login(username: String!, password: String!): User
    addUser(email: String!, username: String!, password: String!): User
    updateUser(email: String, username: String): User
  }
`

export const resolvers = {
  Query: {
    me(parent: undefined, data: undefined, context: any): null {
      return context?.me;
    },
    user(parent: undefined, { _id }: User): User | undefined {
      return allUsers.find((user) => user._id === _id)
    },
    users(): User[] {
      return allUsers
    }
  },
  Mutation: {
    addUser(parent: undefined, { email, username, password }: UserCreate): User {
      const existingUser = allUsers.find((user: User) => user.email === email || user.username === username)

      if (!!existingUser) {
        throw new Error("User with email or username already exists.");
      }

      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      const user = {
        _id: uuidV4(),
        email,
        username,
        password: hashedPassword
      };

      allUsers.push(user)

      return user;
    },
    updateUser(parent: undefined, { email, username }: UserUpdate, context: any): User {
      const userIndex = allUsers.findIndex((user: User) => user._id === context?._id)

      if (userIndex < 0) {
        throw Error("You don't have permission to update resource.");
      }

      const userClone = cloneDeep(allUsers[userIndex])
      allUsers[userIndex] = {
        ...userClone,
        email,
        username
      }

      return allUsers[userIndex]
    },
    login(parent: undefined, { username, password }: UserLogin): User | null {
      const user: User | undefined = allUsers.find((user: User) => user.username === username)

      if (!user) {
        return null;
      }

      if (bcrypt.compareSync(password, user.password)) {
        return {
          ...user,
          token: generateJWT({ _id: user._id })
        };
      }

      return null;
    },
  }
}

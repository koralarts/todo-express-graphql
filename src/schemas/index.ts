import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query{
      _empty: String
  }
  type Mutation {
      _empty: String
  }
`

export * as userSchema from './user';
export * as taskSchema from './task';

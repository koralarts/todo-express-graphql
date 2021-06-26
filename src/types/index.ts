import { User } from './user';

export type GraphqlContext = {
  me: User | undefined
}

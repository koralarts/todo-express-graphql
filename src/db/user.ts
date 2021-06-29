import { FilterQuery } from 'mongodb'
import { User } from "../types/user";
import DatabseService from ".";

export const addUser = (user: User) => DatabseService.use<User>('collection').insertOne(user);

export const updateUser = (user: User) => DatabseService.use<User>('collection').replaceOne({ _id: user._id }, user);

export const getUser = (query: FilterQuery<User>) => DatabseService.use<User>('collection').findOne(query);

import { FilterQuery } from 'mongodb'
import { User } from "../types/user";
import DatabseService from ".";

export const addUser = (user: User) => DatabseService.use<User>('user').insertOne(user);

export const updateUser = (user: User) => DatabseService.use<User>('user').replaceOne({ _id: user._id }, user);

export const getUser = (query: FilterQuery<User>) => DatabseService.use<User>('user').findOne(query);

export const getUsers = (query: FilterQuery<User> = {}) => DatabseService.use<User>('user').find(query);

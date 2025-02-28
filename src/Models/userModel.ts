import knex from "../config/Database";

export interface User {
  
    id: number;
    name: string;
    email: string;
    phone: string;
    bvn: string;
    created_at: Date;
  
}

export const createUser = async (user: Partial<User>): Promise<User> => {
  const [newUser] = await knex<User>("users").insert(user).returning("*");
  return newUser;
};

export const updateUserBlacklistStatus = async (id:Number, isBlacklisted: boolean) => {
  return knex("users").where({ id }).update({ is_blacklisted: isBlacklisted });
};
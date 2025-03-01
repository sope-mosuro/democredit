import knex from "../config/Database";

export interface User {
  
    id: number;
    name: string;
    email: string;
    phone: string;
    bvn: string;
    created_at: Date;
  
}

export const createUser = async (user: Omit<User, "id" | "created_at">): Promise<User> => {
  const [userId] = await knex("users").insert(user);
  const createdUser = await knex("users").where({ id: userId }).first();
  return createdUser;
};

export const updateUserBlacklistStatus = async (id:Number, isBlacklisted: boolean) => {
  return knex("users").where({ id }).update({ is_blacklisted: isBlacklisted });
};
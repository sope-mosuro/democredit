import knex from "../config/Database";

interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  created_at: Date;
}

export const createWallet = async (userId: number): Promise<Wallet> => {
  const [wallet] = await knex("wallets").insert({ user_id: userId, balance: 0 }).returning("*");
  return wallet;
};

export const getWalletByUserId = async (userId: number): Promise<Wallet | null> => {
  const wallet = await knex("wallets").where({ user_id: userId }).first();
  return wallet || null;
};

export const updateWalletBalance = async (walletId: number, amount: number): Promise<void> => {
  await knex("wallets").where({ id: walletId }).increment("balance", amount);
};

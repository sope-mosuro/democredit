import knex from "../config/Database";

export interface Transaction {
  id: number;
  wallet_id: number;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  created_at: Date;
}

export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
  const [newTransaction] = await knex<Transaction>("transactions").insert(transaction).returning("*");
  return newTransaction;
};
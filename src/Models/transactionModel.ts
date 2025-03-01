import knex from "../config/Database";

export interface Transaction {
  id: number;
  wallet_id: number;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  created_at: Date;
}

export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
  const [transactionId] = await knex("transactions").insert(transaction);
  const newTransaction = await knex("transactions").where({ id: transactionId }).first();
  return newTransaction;
};
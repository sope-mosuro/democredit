import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("blacklist").del();

    // Inserts seed entries
    await knex("blacklist").insert([
        { id: 1, user_id: 2, reason: "Fraudulent activity" },
    ]);
};

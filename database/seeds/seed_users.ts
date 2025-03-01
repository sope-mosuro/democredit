import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
    ]);
};

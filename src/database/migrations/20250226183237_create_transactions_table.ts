import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("transactions", (table) => {
        table.increments("id").primary();
        table.integer("wallet_id").unsigned().references("id").inTable("wallets").onDelete("CASCADE");
        table.enum("type", ["deposit", "withdrawal", "transfer"]).notNullable();
        table.decimal("amount", 10, 2).notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transactions");
}


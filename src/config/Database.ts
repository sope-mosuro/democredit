import knex from "knex";
import knexConfig from "./knexfile"; 

const environment ="production"; 
const db = knex(knexConfig[environment]);

export default db;
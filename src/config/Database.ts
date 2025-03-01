import knex from "knex";
import knexConfig from "./knexfile"; 

const environment ="development"; 
const db = knex(knexConfig[environment]);

export default db;
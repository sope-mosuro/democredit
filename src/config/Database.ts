import knex from "knex";
const knexConfig = require("./knexfile"); 

const environment ="production"; 
const db = knex(knexConfig[environment]);

export default db;
import knex from "knex";
const knexConfig = require("./knexfile"); 

const environment ="development"; 
const db = knex(knexConfig[environment]);

export default db;
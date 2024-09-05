const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'macromanagedb',
    password: 'Bananajuice4293!',
    port: 5432,
});

module.exports = pool;

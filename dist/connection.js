"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
exports.testConnection = testConnection;
exports.toCamelCase = toCamelCase;
exports.toSnakeCase = toSnakeCase;
exports.rowsToCamelCase = rowsToCamelCase;
exports.queryOne = queryOne;
exports.queryAll = queryAll;
// /server/db/connection.ts
const serverless_1 = require("@neondatabase/serverless");
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}
// Create the SQL query function
exports.sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
/**
 * Test database connection
 * Returns structured result for production-safe logging
 */
async function testConnection() {
    try {
        const result = await (0, exports.sql) `SELECT NOW() as current_time`;
        console.log('✅ Database connected successfully!');
        console.log('Current database time:', result[0].current_time);
        return { success: true, currentTime: result[0].current_time };
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return { success: false, error };
    }
}
/**
 * Convert snake_case object keys to camelCase
 */
function toCamelCase(obj) {
    const result = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = obj[key];
    }
    return result;
}
/**
 * Convert camelCase object keys to snake_case
 */
function toSnakeCase(obj) {
    const result = {};
    for (const key in obj) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        result[snakeKey] = obj[key];
    }
    return result;
}
/**
 * Convert an array of rows from snake_case to camelCase
 */
function rowsToCamelCase(rows) {
    return rows.map(row => toCamelCase(row));
}
/**
 * Execute a query that should return a single row
 * Returns null if no rows found
 */
async function queryOne(query, ...params) {
    const rows = await (0, exports.sql)(query, ...params);
    return rows.length > 0 ? toCamelCase(rows[0]) : null;
}
/**
 * Execute a query and return all rows mapped to camelCase
 */
async function queryAll(query, ...params) {
    const rows = await (0, exports.sql)(query, ...params);
    return rowsToCamelCase(rows);
}

// /server/db/connection.ts
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the SQL query function
export const sql = neon(process.env.DATABASE_URL);

/**
 * Test database connection
 * Returns structured result for production-safe logging
 */
export async function testConnection(): Promise<{ success: boolean; error?: unknown; currentTime?: string }> {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully!');
    console.log('Current database time:', result[0].current_time);
    return { success: true, currentTime: result[0].current_time };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error };
  }
}

/**
 * Convert snake_case object keys to camelCase
 */
export function toCamelCase<T extends Record<string, any>>(obj: Record<string, any>): T {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result as T;
}

/**
 * Convert camelCase object keys to snake_case
 */
export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

/**
 * Convert an array of rows from snake_case to camelCase
 */
export function rowsToCamelCase<T extends Record<string, any>>(rows: Record<string, any>[]): T[] {
  return rows.map(row => toCamelCase<T>(row));
}

/**
 * Execute a query that should return a single row
 * Returns null if no rows found
 */
export async function queryOne<T extends Record<string, any>>(query: TemplateStringsArray, ...params: any[]): Promise<T | null> {
  const rows = await sql(query, ...params);
  return rows.length > 0 ? toCamelCase<T>(rows[0]) : null;
}

/**
 * Execute a query and return all rows mapped to camelCase
 */
export async function queryAll<T extends Record<string, any>>(query: TemplateStringsArray, ...params: any[]): Promise<T[]> {
  const rows = await sql(query, ...params);
  return rowsToCamelCase<T>(rows);
}
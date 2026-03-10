require("dotenv").config();

const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const mysql = require("mysql2/promise");

const execFileAsync = promisify(execFile);
const client = process.env.DB_CLIENT || "sqlite";

let mysqlPool;

function getSqliteFile() {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  if (url.startsWith("file:")) {
    return path.resolve(__dirname, "..", url.slice(5));
  }

  return path.resolve(__dirname, "..", "dev.db");
}

function escapeSqliteValue(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function injectParams(sql, params = []) {
  let index = 0;
  return sql.replace(/\?/g, () => escapeSqliteValue(params[index++]));
}

function parseJsonLines(output) {
  if (!output.trim()) {
    return [];
  }

  const matches = output.trim().match(/\[[\s\S]*?\](?=\n\[|$)/g);
  if (!matches) {
    return [];
  }

  return matches.map((chunk) => JSON.parse(chunk));
}

async function sqliteQuery(sql, params = []) {
  const finalSql = injectParams(sql, params);
  const { stdout } = await execFileAsync("sqlite3", ["-json", getSqliteFile(), finalSql]);
  const chunks = parseJsonLines(stdout);
  return chunks[0] || [];
}

async function sqliteRun(sql, params = []) {
  const finalSql = `${injectParams(sql, params)}; SELECT changes() AS changes, last_insert_rowid() AS lastID;`;
  const { stdout } = await execFileAsync("sqlite3", ["-json", getSqliteFile(), finalSql]);
  const chunks = parseJsonLines(stdout);
  const row = chunks[chunks.length - 1]?.[0] || {};
  return {
    lastID: row.lastID || 0,
    changes: row.changes || 0,
  };
}

async function connect() {
  if (client !== "mysql") {
    return null;
  }

  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "therehabhouse",
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  return mysqlPool;
}

async function query(sql, params = []) {
  if (client === "mysql") {
    const pool = await connect();
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  return sqliteQuery(sql, params);
}

async function get(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

async function run(sql, params = []) {
  if (client === "mysql") {
    const pool = await connect();
    const [result] = await pool.execute(sql, params);
    return {
      lastID: result.insertId || 0,
      changes: result.affectedRows || 0,
    };
  }

  return sqliteRun(sql, params);
}

async function transaction(callback) {
  if (client === "mysql") {
    const pool = await connect();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const scoped = {
        query: async (sql, params = []) => {
          const [rows] = await connection.execute(sql, params);
          return rows;
        },
        get: async (sql, params = []) => {
          const [rows] = await connection.execute(sql, params);
          return rows[0] || null;
        },
        run: async (sql, params = []) => {
          const [result] = await connection.execute(sql, params);
          return { lastID: result.insertId || 0, changes: result.affectedRows || 0 };
        },
      };
      const result = await callback(scoped);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  return callback({ query, get, run });
}

function mysqlCreateStatements() {
  return [
    `CREATE TABLE IF NOT EXISTS \`Page\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      template VARCHAR(100) DEFAULT 'default',
      content LONGTEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'draft',
      seo_title VARCHAR(255) NULL,
      seo_description TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Blog\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content LONGTEXT NULL,
      excerpt TEXT NULL,
      featured_image VARCHAR(255) NULL,
      category VARCHAR(255) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'draft',
      seo_title VARCHAR(255) NULL,
      seo_description TEXT NULL,
      published_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Gallery\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image VARCHAR(255) NOT NULL,
      caption TEXT NULL,
      \`order\` INT NOT NULL DEFAULT 0,
      page_id INT NULL,
      CONSTRAINT gallery_page_fk FOREIGN KEY (page_id) REFERENCES \`Page\`(id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS \`Faq\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer LONGTEXT NOT NULL,
      \`order\` INT NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'published'
    )`,
    `CREATE TABLE IF NOT EXISTS \`Banner\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      title VARCHAR(255) NULL,
      subtitle TEXT NULL,
      cta_text VARCHAR(255) NULL,
      cta_link VARCHAR(255) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'published'
    )`,
    `CREATE TABLE IF NOT EXISTS \`User\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'editor',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Setting\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`key\` VARCHAR(255) NOT NULL UNIQUE,
      value LONGTEXT NOT NULL
    )`,
  ];
}

function sqliteCreateStatements() {
  return [
    `CREATE TABLE IF NOT EXISTS \`Page\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`title\` TEXT NOT NULL,
      \`slug\` TEXT NOT NULL UNIQUE,
      \`template\` TEXT DEFAULT 'default',
      \`content\` TEXT,
      \`status\` TEXT NOT NULL DEFAULT 'draft',
      \`seo_title\` TEXT,
      \`seo_description\` TEXT,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Blog\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`title\` TEXT NOT NULL,
      \`slug\` TEXT NOT NULL UNIQUE,
      \`content\` TEXT,
      \`excerpt\` TEXT,
      \`featured_image\` TEXT,
      \`category\` TEXT,
      \`status\` TEXT NOT NULL DEFAULT 'draft',
      \`seo_title\` TEXT,
      \`seo_description\` TEXT,
      \`published_at\` DATETIME,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Gallery\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`image\` TEXT NOT NULL,
      \`caption\` TEXT,
      \`order\` INTEGER NOT NULL DEFAULT 0,
      \`page_id\` INTEGER,
      FOREIGN KEY (\`page_id\`) REFERENCES \`Page\` (\`id\`) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS \`Faq\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`question\` TEXT NOT NULL,
      \`answer\` TEXT NOT NULL,
      \`order\` INTEGER NOT NULL DEFAULT 0,
      \`status\` TEXT NOT NULL DEFAULT 'published'
    )`,
    `CREATE TABLE IF NOT EXISTS \`Banner\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`page\` TEXT NOT NULL,
      \`image\` TEXT NOT NULL,
      \`title\` TEXT,
      \`subtitle\` TEXT,
      \`cta_text\` TEXT,
      \`cta_link\` TEXT,
      \`status\` TEXT NOT NULL DEFAULT 'published'
    )`,
    `CREATE TABLE IF NOT EXISTS \`User\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`name\` TEXT NOT NULL,
      \`email\` TEXT NOT NULL UNIQUE,
      \`password\` TEXT NOT NULL,
      \`role\` TEXT NOT NULL DEFAULT 'editor',
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS \`Setting\` (
      \`id\` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      \`key\` TEXT NOT NULL UNIQUE,
      \`value\` TEXT NOT NULL
    )`,
  ];
}

async function columnExists(table, column) {
  if (client === "mysql") {
    const row = await get(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
      [table, column]
    );
    return Boolean(row);
  }

  const rows = await query(`PRAGMA table_info(\`${table}\`)`);
  return rows.some((row) => row.name === column);
}

async function ensureColumn(table, column, sqlType) {
  const exists = await columnExists(table, column);
  if (exists) {
    return;
  }

  await run(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${sqlType}`);
}

async function ensureSchema() {
  const statements = client === "mysql" ? mysqlCreateStatements() : sqliteCreateStatements();
  for (const statement of statements) {
    await run(statement);
  }

  await ensureColumn("Blog", "excerpt", client === "mysql" ? "TEXT NULL" : "TEXT");
  await ensureColumn("Blog", "published_at", client === "mysql" ? "DATETIME NULL" : "DATETIME");
}

module.exports = {
  client,
  connect,
  query,
  get,
  run,
  transaction,
  ensureSchema,
};

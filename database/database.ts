import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function initializeDatabase() {
  db = await SQLite.openDatabaseAsync('budget.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      emoji TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      emoji TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS spending_goals (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      weekly_limit REAL NOT NULL
    );
  `);

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error(
      'Database has not been initialized.'
    );
  }

  return db;
}

// ========================================
// EXPENSES
// ========================================

export async function getExpenses() {
  const database = getDatabase();

  return await database.getAllAsync<{
    id: number;
    amount: number;
    description: string;
    category: string;
    emoji: string;
    date: string;
    notes: string | null;
  }>(
    'SELECT * FROM expenses ORDER BY id DESC'
  );
}

export async function addExpense(expense: {
  amount: number;
  description: string;
  category: string;
  emoji: string;
  date: string;
  notes: string;
}) {
  const database = getDatabase();

  await database.runAsync(
    `
      INSERT INTO expenses
      (
        amount,
        description,
        category,
        emoji,
        date,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    expense.amount,
    expense.description,
    expense.category,
    expense.emoji,
    expense.date,
    expense.notes
  );
}

export async function updateExpense(
  id: number,
  expense: {
    amount: number;
    description: string;
    category: string;
    emoji: string;
    date: string;
    notes: string;
  }
) {
  const database = getDatabase();

  await database.runAsync(
    `
      UPDATE expenses
      SET
        amount = ?,
        description = ?,
        category = ?,
        emoji = ?,
        date = ?,
        notes = ?
      WHERE id = ?
    `,
    expense.amount,
    expense.description,
    expense.category,
    expense.emoji,
    expense.date,
    expense.notes,
    id
  );
}

export async function deleteExpense(
  id: number
) {
  const database = getDatabase();

  await database.runAsync(
    'DELETE FROM expenses WHERE id = ?',
    id
  );
}

// ========================================
// PRESETS
// ========================================

export async function getPresets() {
  const database = getDatabase();

  return await database.getAllAsync<{
    id: number;
    name: string;
    amount: number;
    category: string;
    emoji: string;
    notes: string | null;
  }>(
    'SELECT * FROM presets ORDER BY id DESC'
  );
}

export async function addPreset(preset: {
  name: string;
  amount: number;
  category: string;
  emoji: string;
  notes: string;
}) {
  const database = getDatabase();

  await database.runAsync(
    `
      INSERT INTO presets
      (
        name,
        amount,
        category,
        emoji,
        notes
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    preset.name,
    preset.amount,
    preset.category,
    preset.emoji,
    preset.notes
  );
}

export async function deletePreset(
  id: number
) {
  const database = getDatabase();

  await database.runAsync(
    'DELETE FROM presets WHERE id = ?',
    id
  );
}

export async function addExpenseFromPreset(
  preset: {
    amount: number;
    name: string;
    category: string;
    emoji: string;
    notes: string;
  }
) {
  const database = getDatabase();

  const today =
    new Date().toISOString().split('T')[0];

  await database.runAsync(
    `
      INSERT INTO expenses
      (
        amount,
        description,
        category,
        emoji,
        date,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    preset.amount,
    preset.name,
    preset.category,
    preset.emoji,
    today,
    preset.notes
  );
}

// ========================================
// WEEKLY SPENDING GOAL
// ========================================

export async function getWeeklyGoal() {
  const database = getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS spending_goals (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      weekly_limit REAL NOT NULL
    );
  `);

  return await database.getFirstAsync<{
    id: number;
    weekly_limit: number;
  }>(
    'SELECT * FROM spending_goals WHERE id = 1'
  );
}

export async function setWeeklyGoal(
  amount: number
) {
  const database = getDatabase();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS spending_goals (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      weekly_limit REAL NOT NULL
    );
  `);

  const existing = await database.getFirstAsync<{
    id: number;
    weekly_limit: number;
  }>(
    'SELECT * FROM spending_goals WHERE id = 1'
  );

  if (existing) {
    await database.runAsync(
      `
        UPDATE spending_goals
        SET weekly_limit = ?
        WHERE id = 1
      `,
      amount
    );
  } else {
    await database.runAsync(
      `
        INSERT INTO spending_goals
        (id, weekly_limit)
        VALUES (1, ?)
      `,
      amount
    );
  }
}
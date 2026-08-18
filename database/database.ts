import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
} from 'idb';

// ========================================
// TYPES
// ========================================

export type Expense = {
  id: number;
  amount: number;
  description: string;
  category: string;
  emoji: string;
  date: string;
  notes: string | null;
};

export type Preset = {
  id: number;
  name: string;
  amount: number;
  category: string;
  emoji: string;
  notes: string | null;
};

export type Budget = {
  id: number;
  category: string;
  amount: number;
};

export type SpendingGoal = {
  id: number;
  weekly_limit: number;
};

// ========================================
// INDEXEDDB SCHEMA
// ========================================

interface BudgetingDB extends DBSchema {
  expenses: {
    key: number;
    value: Expense;
    indexes: {
      'by-date': string;
      'by-category': string;
    };
  };

  budgets: {
    key: number;
    value: Budget;
    indexes: {
      'by-category': string;
    };
  };

  presets: {
    key: number;
    value: Preset;
  };

  spending_goals: {
    key: number;
    value: SpendingGoal;
  };
}

// ========================================
// DATABASE
// ========================================

let db: IDBPDatabase<BudgetingDB> | null = null;

export async function initializeDatabase() {
  if (db) {
    return db;
  }

  db = await openDB<BudgetingDB>(
    'budget.db',
    1,
    {
      upgrade(database) {
        // ========================================
        // EXPENSES
        // ========================================

        if (
          !database.objectStoreNames.contains(
            'expenses'
          )
        ) {
          const expenses =
            database.createObjectStore(
              'expenses',
              {
                keyPath: 'id',
                autoIncrement: true,
              }
            );

          expenses.createIndex(
            'by-date',
            'date'
          );

          expenses.createIndex(
            'by-category',
            'category'
          );
        }

        // ========================================
        // BUDGETS
        // ========================================

        if (
          !database.objectStoreNames.contains(
            'budgets'
          )
        ) {
          const budgets =
            database.createObjectStore(
              'budgets',
              {
                keyPath: 'id',
                autoIncrement: true,
              }
            );

          budgets.createIndex(
            'by-category',
            'category',
            {
              unique: true,
            }
          );
        }

        // ========================================
        // PRESETS
        // ========================================

        if (
          !database.objectStoreNames.contains(
            'presets'
          )
        ) {
          database.createObjectStore(
            'presets',
            {
              keyPath: 'id',
              autoIncrement: true,
            }
          );
        }

        // ========================================
        // SPENDING GOALS
        // ========================================

        if (
          !database.objectStoreNames.contains(
            'spending_goals'
          )
        ) {
          database.createObjectStore(
            'spending_goals',
            {
              keyPath: 'id',
            }
          );
        }
      },
    }
  );

  return db;
}

// ========================================
// GET DATABASE
// ========================================

export async function getDatabase() {
  if (!db) {
    await initializeDatabase();
  }

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

export async function getExpenses(): Promise<
  Expense[]
> {
  const database =
    await getDatabase();

  const expenses =
    await database.getAll(
      'expenses'
    );

  return expenses.sort(
    (a, b) => b.id - a.id
  );
}

// ========================================
// ADD EXPENSE
// ========================================

export async function addExpense(
  expense: {
    amount: number;
    description: string;
    category: string;
    emoji: string;
    date: string;
    notes: string;
  }
) {
  const database =
    await getDatabase();

  await database.add(
    'expenses',
    {
      id: 0,
      amount: expense.amount,
      description:
        expense.description,
      category: expense.category,
      emoji: expense.emoji,
      date: expense.date,
      notes: expense.notes,
    }
  );
}

// ========================================
// UPDATE EXPENSE
// ========================================

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
  const database =
    await getDatabase();

  const existing =
    await database.get(
      'expenses',
      id
    );

  if (!existing) {
    throw new Error(
      `Expense with id ${id} not found.`
    );
  }

  await database.put(
    'expenses',
    {
      id,
      amount: expense.amount,
      description:
        expense.description,
      category: expense.category,
      emoji: expense.emoji,
      date: expense.date,
      notes: expense.notes,
    }
  );
}

// ========================================
// DELETE EXPENSE
// ========================================

export async function deleteExpense(
  id: number
) {
  const database =
    await getDatabase();

  await database.delete(
    'expenses',
    id
  );
}

// ========================================
// PRESETS
// ========================================

export async function getPresets(): Promise<
  Preset[]
> {
  const database =
    await getDatabase();

  const presets =
    await database.getAll(
      'presets'
    );

  return presets.sort(
    (a, b) => b.id - a.id
  );
}

// ========================================
// ADD PRESET
// ========================================

export async function addPreset(
  preset: {
    name: string;
    amount: number;
    category: string;
    emoji: string;
    notes: string;
  }
) {
  const database =
    await getDatabase();

  await database.add(
    'presets',
    {
      id: 0,
      name: preset.name,
      amount: preset.amount,
      category: preset.category,
      emoji: preset.emoji,
      notes: preset.notes,
    }
  );
}

// ========================================
// DELETE PRESET
// ========================================

export async function deletePreset(
  id: number
) {
  const database =
    await getDatabase();

  await database.delete(
    'presets',
    id
  );
}

// ========================================
// ADD EXPENSE FROM PRESET
// ========================================

export async function addExpenseFromPreset(
  preset: {
    amount: number;
    name: string;
    category: string;
    emoji: string;
    notes: string;
  }
) {
  const database =
    await getDatabase();

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  await database.add(
    'expenses',
    {
      id: 0,
      amount: preset.amount,
      description: preset.name,
      category: preset.category,
      emoji: preset.emoji,
      date: today,
      notes: preset.notes,
    }
  );
}

// ========================================
// BUDGETS
// ========================================

export async function getBudgets(): Promise<
  Budget[]
> {
  const database =
    await getDatabase();

  const budgets =
    await database.getAll(
      'budgets'
    );

  return budgets.sort(
    (a, b) => b.id - a.id
  );
}

// ========================================
// ADD / UPDATE BUDGET
// ========================================

export async function setBudget(
  category: string,
  amount: number
) {
  const database =
    await getDatabase();

  const existing =
    await database
      .getAllFromIndex(
        'budgets',
        'by-category',
        category
      );

  if (existing.length > 0) {
    await database.put(
      'budgets',
      {
        id: existing[0].id,
        category,
        amount,
      }
    );
  } else {
    await database.add(
      'budgets',
      {
        id: 0,
        category,
        amount,
      }
    );
  }
}

// ========================================
// DELETE BUDGET
// ========================================

export async function deleteBudget(
  id: number
) {
  const database =
    await getDatabase();

  await database.delete(
    'budgets',
    id
  );
}

// ========================================
// WEEKLY SPENDING GOAL
// ========================================

export async function getWeeklyGoal(): Promise<
  SpendingGoal | undefined
> {
  const database =
    await getDatabase();

  return await database.get(
    'spending_goals',
    1
  );
}

// ========================================
// SET WEEKLY GOAL
// ========================================

export async function setWeeklyGoal(
  amount: number
) {
  const database =
    await getDatabase();

  await database.put(
    'spending_goals',
    {
      id: 1,
      weekly_limit: amount,
    }
  );
}
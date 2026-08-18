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
// DATABASE
// ========================================

const DB_NAME = 'budgeting-app';
const DB_VERSION = 1;

let database: IDBDatabase | null = null;

// ========================================
// OPEN DATABASE
// ========================================

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (database) {
      resolve(database);
      return;
    }

    if (
      typeof window === 'undefined' ||
      !window.indexedDB
    ) {
      reject(
        new Error(
          'IndexedDB is not available in this environment.'
        )
      );

      return;
    }

    const request = window.indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onupgradeneeded = () => {
      const db = request.result;

      // ========================================
      // EXPENSES
      // ========================================

      if (!db.objectStoreNames.contains('expenses')) {
        const expenses =
          db.createObjectStore('expenses', {
            keyPath: 'id',
            autoIncrement: true,
          });

        expenses.createIndex(
          'by-date',
          'date',
          { unique: false }
        );

        expenses.createIndex(
          'by-category',
          'category',
          { unique: false }
        );
      }

      // ========================================
      // BUDGETS
      // ========================================

      if (!db.objectStoreNames.contains('budgets')) {
        const budgets =
          db.createObjectStore('budgets', {
            keyPath: 'id',
            autoIncrement: true,
          });

        budgets.createIndex(
          'by-category',
          'category',
          { unique: true }
        );
      }

      // ========================================
      // PRESETS
      // ========================================

      if (!db.objectStoreNames.contains('presets')) {
        db.createObjectStore('presets', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }

      // ========================================
      // SPENDING GOALS
      // ========================================

      if (
        !db.objectStoreNames.contains(
          'spending_goals'
        )
      ) {
        db.createObjectStore(
          'spending_goals',
          {
            keyPath: 'id',
          }
        );
      }
    };

    request.onsuccess = () => {
      database = request.result;

      database.onclose = () => {
        database = null;
      };

      resolve(database);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ========================================
// INITIALIZE DATABASE
// ========================================

export async function initializeDatabase() {
  return await openDatabase();
}

// ========================================
// GET DATABASE
// ========================================

export async function getDatabase() {
  return await openDatabase();
}

// ========================================
// HELPER
// ========================================

function requestToPromise<T>(
  request: IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function transactionComplete(
  transaction: IDBTransaction
): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    transaction.onabort = () => {
      reject(transaction.error);
    };
  });
}

// ========================================
// EXPENSES
// ========================================

export async function getExpenses(): Promise<
  Expense[]
> {
  const db = await getDatabase();

  const transaction = db.transaction(
    'expenses',
    'readonly'
  );

  const store =
    transaction.objectStore('expenses');

  const request = store.getAll();

  const expenses =
    await requestToPromise(request);

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
  const db = await getDatabase();

  const transaction = db.transaction(
    'expenses',
    'readwrite'
  );

  const store =
    transaction.objectStore('expenses');

  store.add({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    emoji: expense.emoji,
    date: expense.date,
    notes: expense.notes,
  });

  await transactionComplete(transaction);
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
  const db = await getDatabase();

  const transaction = db.transaction(
    'expenses',
    'readwrite'
  );

  const store =
    transaction.objectStore('expenses');

  store.put({
    id,
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    emoji: expense.emoji,
    date: expense.date,
    notes: expense.notes,
  });

  await transactionComplete(transaction);
}

// ========================================
// DELETE EXPENSE
// ========================================

export async function deleteExpense(
  id: number
) {
  const db = await getDatabase();

  const transaction = db.transaction(
    'expenses',
    'readwrite'
  );

  const store =
    transaction.objectStore('expenses');

  store.delete(id);

  await transactionComplete(transaction);
}

// ========================================
// PRESETS
// ========================================

export async function getPresets(): Promise<
  Preset[]
> {
  const db = await getDatabase();

  const transaction = db.transaction(
    'presets',
    'readonly'
  );

  const store =
    transaction.objectStore('presets');

  const request = store.getAll();

  const presets =
    await requestToPromise(request);

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
  const db = await getDatabase();

  const transaction = db.transaction(
    'presets',
    'readwrite'
  );

  const store =
    transaction.objectStore('presets');

  store.add({
    name: preset.name,
    amount: preset.amount,
    category: preset.category,
    emoji: preset.emoji,
    notes: preset.notes,
  });

  await transactionComplete(transaction);
}

// ========================================
// DELETE PRESET
// ========================================

export async function deletePreset(
  id: number
) {
  const db = await getDatabase();

  const transaction = db.transaction(
    'presets',
    'readwrite'
  );

  const store =
    transaction.objectStore('presets');

  store.delete(id);

  await transactionComplete(transaction);
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
  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  await addExpense({
    amount: preset.amount,
    description: preset.name,
    category: preset.category,
    emoji: preset.emoji,
    date: today,
    notes: preset.notes,
  });
}

// ========================================
// BUDGETS
// ========================================

export async function getBudgets(): Promise<
  Budget[]
> {
  const db = await getDatabase();

  const transaction = db.transaction(
    'budgets',
    'readonly'
  );

  const store =
    transaction.objectStore('budgets');

  const request = store.getAll();

  const budgets =
    await requestToPromise(request);

  return budgets.sort(
    (a, b) => b.id - a.id
  );
}

// ========================================
// SET BUDGET
// ========================================

export async function setBudget(
  category: string,
  amount: number
) {
  const db = await getDatabase();

  const transaction = db.transaction(
    'budgets',
    'readwrite'
  );

  const store =
    transaction.objectStore('budgets');

  const index =
    store.index('by-category');

  const existingRequest =
    index.get(category);

  const existing =
    await requestToPromise(
      existingRequest
    );

  if (existing) {
    store.put({
      id: existing.id,
      category,
      amount,
    });
  } else {
    store.add({
      category,
      amount,
    });
  }

  await transactionComplete(transaction);
}

// ========================================
// DELETE BUDGET
// ========================================

export async function deleteBudget(
  id: number
) {
  const db = await getDatabase();

  const transaction = db.transaction(
    'budgets',
    'readwrite'
  );

  const store =
    transaction.objectStore('budgets');

  store.delete(id);

  await transactionComplete(transaction);
}

// ========================================
// WEEKLY GOAL
// ========================================

export async function getWeeklyGoal(): Promise<
  SpendingGoal | undefined
> {
  const db = await getDatabase();

  const transaction = db.transaction(
    'spending_goals',
    'readonly'
  );

  const store =
    transaction.objectStore(
      'spending_goals'
    );

  const request = store.get(1);

  return await requestToPromise(request);
}

// ========================================
// SET WEEKLY GOAL
// ========================================

export async function setWeeklyGoal(
  amount: number
) {
  const db = await getDatabase();

  const transaction = db.transaction(
    'spending_goals',
    'readwrite'
  );

  const store =
    transaction.objectStore(
      'spending_goals'
    );

  store.put({
    id: 1,
    weekly_limit: amount,
  });

  await transactionComplete(transaction);
}
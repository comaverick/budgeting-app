import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import {
  addExpense as saveExpense,
  addExpenseFromPreset,
  addPreset,
  deleteExpense,
  getExpenses,
  getPresets,
  updateExpense,
} from '../../database/database';

import { styles } from './expenses.styles';

type Category = {
  name: string;
  emoji: string;
};

type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
  emoji: string;
  date: string;
  notes: string;
};

const categories: Category[] = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Groceries', emoji: '🛒' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Bills', emoji: '🧾' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Entertainment', emoji: '🎮' },
  { name: 'Health', emoji: '💊' },
  { name: 'Other', emoji: '💸' },
];

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [presets, setPresets] = useState<any[]>([]);

  const [presetName, setPresetName] = useState('');
  const [presetAmount, setPresetAmount] = useState('');
  const [presetCategory, setPresetCategory] =
    useState('Transport');
  const [presetNotes, setPresetNotes] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [presetModalVisible, setPresetModalVisible] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('Food');
  const [notes, setNotes] = useState('');

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const [calendarVisible, setCalendarVisible] =
    useState(false);

  useEffect(() => {
    loadExpenses();
    loadPresets();
  }, []);

  // =========================
  // LOAD EXPENSES
  // =========================

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();

      const formattedExpenses: Expense[] = data.map(
        (item) => ({
          id: item.id.toString(),
          name: item.description,
          category: item.category,
          amount: item.amount,
          emoji: item.emoji,
          date: item.date,
          notes: item.notes ?? '',
        })
      );

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error(
        'Failed to load expenses:',
        error
      );
    }
  };

  // =========================
  // LOAD PRESETS
  // =========================

  const loadPresets = async () => {
    try {
      const data = await getPresets();
      setPresets(data);
    } catch (error) {
      console.error(
        'Failed to load presets:',
        error
      );
    }
  };

  // =========================
  // FORM
  // =========================

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory('Food');
    setNotes('');
    setEditingExpense(null);
    setSelectedDate(new Date());
    setCalendarVisible(false);
  };

  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  // =========================
  // EDIT EXPENSE
  // =========================

  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense);

    setAmount(expense.amount.toString());
    setDescription(expense.name);
    setSelectedCategory(expense.category);
    setNotes(expense.notes);

    const [year, month, day] = expense.date
      .split('-')
      .map(Number);

    setSelectedDate(
      new Date(year, month - 1, day)
    );

    setCalendarVisible(false);
    setModalVisible(true);
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Delete "${expense.name}" for ₱${expense.amount.toLocaleString(
        'en-PH',
        {
          minimumFractionDigits: 2,
        }
      )}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(
                Number(expense.id)
              );

              await loadExpenses();
            } catch (error) {
              console.error(
                'Failed to delete expense:',
                error
              );
            }
          },
        },
      ]
    );
  };

  // =========================
  // DATE
  // =========================

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day);
    }

    return days;
  };

  const changeMonth = (amount: number) => {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + amount,
        1
      )
    );
  };

  const selectDate = (day: number) => {
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );

    setSelectedDate(newDate);
    setCalendarVisible(false);
  };

  // =========================
  // SAVE EXPENSE
  // =========================

  const saveExpenseForm = async () => {
    const numericAmount = Number(amount);

    if (
      !amount ||
      numericAmount <= 0 ||
      !description.trim()
    ) {
      return;
    }

    const selectedCategoryData =
      categories.find(
        (category) =>
          category.name === selectedCategory
      );

    try {
      const expenseData = {
        amount: numericAmount,
        description: description.trim(),
        category: selectedCategory,
        emoji:
          selectedCategoryData?.emoji ?? '💸',
        date: formatDate(selectedDate),
        notes: notes.trim(),
      };

      if (editingExpense) {
        await updateExpense(
          Number(editingExpense.id),
          expenseData
        );
      } else {
        await saveExpense(expenseData);
      }

      await loadExpenses();
      closeModal();
    } catch (error) {
      console.error(
        'Failed to save expense:',
        error
      );
    }
  };

  // =========================
  // QUICK ADD PRESET
  // =========================

  const usePreset = async (preset: any) => {
    try {
      await addExpenseFromPreset({
        amount: preset.amount,
        name: preset.name,
        category: preset.category,
        emoji: preset.emoji,
        notes: preset.notes ?? '',
      });

      await loadExpenses();
    } catch (error) {
      console.error(
        'Failed to add preset expense:',
        error
      );
    }
  };

  // =========================
  // UI
  // =========================

  const savePreset = async () => {
  const numericAmount = Number(presetAmount);

  if (
    !presetName.trim() ||
    !presetAmount ||
    numericAmount <= 0
  ) {
    return;
  }

  const selectedCategoryData = categories.find(
    (category) =>
      category.name === presetCategory
  );

  try {
    await addPreset({
      name: presetName.trim(),
      amount: numericAmount,
      category: presetCategory,
      emoji: selectedCategoryData?.emoji ?? '💸',
      notes: presetNotes.trim(),
    });

    await loadPresets();

    setPresetName('');
    setPresetAmount('');
    setPresetCategory('Transport');
    setPresetNotes('');

    setPresetModalVisible(false);
  } catch (error) {
    console.error(
      'Failed to save preset:',
      error
    );
  }
};

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Expenses
          </Text>

          <Text style={styles.subtitle}>
            Track where your money goes
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </Pressable>
      </View>

      {/* QUICK ADD */}

      <View style={styles.quickAddSection}>

        <View style={styles.quickAddHeader}>
          <Text style={styles.quickAddTitle}>
            Quick Add
          </Text>

          <Pressable
            onPress={() =>
              setPresetModalVisible(true)
            }
          >
            <Text style={styles.managePresets}>
              + Add Preset
            </Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={presets}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={
            styles.presetList
          }
          ListEmptyComponent={
            <View style={styles.noPresets}>
              <Text style={styles.noPresetsText}>
                No presets yet. Add one for
                expenses you use often.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.presetCard}
              onPress={() =>
                usePreset(item)
              }
            >
              <Text style={styles.presetEmoji}>
                {item.emoji}
              </Text>

              <Text style={styles.presetName}>
                {item.name}
              </Text>

              <Text style={styles.presetAmount}>
                ₱
                {item.amount.toLocaleString(
                  'en-PH',
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Text>
            </Pressable>
          )}
        />

      </View>

      {/* EXPENSE LIST */}

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              💸
            </Text>

            <Text style={styles.emptyTitle}>
              No expenses yet
            </Text>

            <Text style={styles.emptyText}>
              Tap + to record your first expense.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            renderRightActions={() => (
              <View style={styles.swipeActions}>

                <Pressable
                  style={styles.editAction}
                  onPress={() =>
                    openEditExpense(item)
                  }
                >
                  <Ionicons
                    name="pencil"
                    size={22}
                    color="#555"
                  />
                </Pressable>

                <Pressable
                  style={styles.deleteAction}
                  onPress={() =>
                    handleDeleteExpense(item)
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#FFF"
                  />
                </Pressable>

              </View>
            )}
          >
            <View style={styles.expenseCard}>

              <View style={styles.expenseLeft}>

                <View style={styles.iconContainer}>
                  <Text style={styles.emoji}>
                    {item.emoji}
                  </Text>
                </View>

                <View>
                  <Text style={styles.expenseName}>
                    {item.name}
                  </Text>

                  <View
                    style={styles.categoryRow}
                  >
                    <Text
                      style={styles.category}
                    >
                      {item.category}
                    </Text>

                    <Text style={styles.date}>
                      • {item.date}
                    </Text>
                  </View>
                </View>

              </View>

              <Text style={styles.expenseAmount}>
                -₱
                {item.amount.toLocaleString(
                  'en-PH',
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </Text>

            </View>
          </ReanimatedSwipeable>
        )}
      />

      {/* ADD / EDIT EXPENSE MODAL */}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View style={styles.modal}>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingExpense
                    ? 'Edit Expense'
                    : 'Add Expense'}
                </Text>

                <Pressable
                  onPress={closeModal}
                >
                  <Text style={styles.closeButton}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* AMOUNT */}

              <Text style={styles.inputLabel}>
                Amount
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.currency}>
                  ₱
                </Text>

                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* DESCRIPTION */}

              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={styles.input}
                placeholder="What did you spend on?"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
              />

              {/* CATEGORY */}

              <Text style={styles.inputLabel}>
                Category
              </Text>

              <View style={styles.categoryGrid}>
                {categories.map(
                  (category) => {
                    const isSelected =
                      selectedCategory ===
                      category.name;

                    return (
                      <Pressable
                        key={category.name}
                        style={[
                          styles.categoryButton,
                          isSelected &&
                            styles.categoryButtonSelected,
                        ]}
                        onPress={() =>
                          setSelectedCategory(
                            category.name
                          )
                        }
                      >
                        <Text
                          style={
                            styles.categoryEmoji
                          }
                        >
                          {category.emoji}
                        </Text>

                        <Text
                          style={[
                            styles.categoryButtonText,
                            isSelected &&
                              styles.categoryButtonTextSelected,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>

              {/* DATE */}

              <Text style={styles.inputLabel}>
                Date
              </Text>

              <Pressable
                style={styles.dateInput}
                onPress={() =>
                  setCalendarVisible(
                    !calendarVisible
                  )
                }
              >
                <Text style={styles.dateIcon}>
                  📅
                </Text>

                <Text style={styles.dateText}>
                  {formatDisplayDate(
                    selectedDate
                  )}
                </Text>

                <Text style={styles.dateArrow}>
                  {calendarVisible
                    ? '⌃'
                    : '›'}
                </Text>
              </Pressable>

              {calendarVisible && (
                <View
                  style={
                    styles.calendarContainer
                  }
                >

                  <View
                    style={
                      styles.calendarHeader
                    }
                  >
                    <Pressable
                      onPress={() =>
                        changeMonth(-1)
                      }
                      style={
                        styles.monthButton
                      }
                    >
                      <Text
                        style={
                          styles.monthArrow
                        }
                      >
                        ‹
                      </Text>
                    </Pressable>

                    <Text
                      style={
                        styles.monthTitle
                      }
                    >
                      {selectedDate.toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </Text>

                    <Pressable
                      onPress={() =>
                        changeMonth(1)
                      }
                      style={
                        styles.monthButton
                      }
                    >
                      <Text
                        style={
                          styles.monthArrow
                        }
                      >
                        ›
                      </Text>
                    </Pressable>
                  </View>

                  <View style={styles.weekRow}>
                    {[
                      'SUN',
                      'MON',
                      'TUE',
                      'WED',
                      'THU',
                      'FRI',
                      'SAT',
                    ].map((day) => (
                      <Text
                        key={day}
                        style={
                          styles.weekDay
                        }
                      >
                        {day}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.daysGrid}>
                    {getDaysInMonth(
                      selectedDate
                    ).map(
                      (day, index) => {
                        if (
                          day === null
                        ) {
                          return (
                            <View
                              key={index}
                              style={
                                styles.dayCell
                              }
                            />
                          );
                        }

                        const isSelected =
                          day ===
                          selectedDate.getDate();

                        return (
                          <Pressable
                            key={index}
                            style={
                              styles.dayCell
                            }
                            onPress={() =>
                              selectDate(day)
                            }
                          >
                            <View
                              style={[
                                styles.dayCircle,
                                isSelected &&
                                  styles.selectedDay,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dayText,
                                  isSelected &&
                                    styles.selectedDayText,
                                ]}
                              >
                                {day}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                </View>
              )}

              {/* NOTES */}

              <Text style={styles.inputLabel}>
                Notes{' '}
                <Text
                  style={styles.optional}
                >
                  (Optional)
                </Text>
              </Text>

              <TextInput
                style={styles.notesInput}
                placeholder="Add a note..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />

              {/* SAVE */}

              <Pressable
                style={[
                  styles.saveButton,
                  (!amount ||
                    !description.trim()) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={saveExpenseForm}
                disabled={
                  !amount ||
                  !description.trim()
                }
              >
                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {editingExpense
                    ? 'Save Changes'
                    : 'Add Expense'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </Pressable>

            </ScrollView>

          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* PRESET MODAL WILL BE ADDED NEXT */}
      {/* CREATE PRESET MODAL */}

      <Modal
        animationType="slide"
        transparent
        visible={presetModalVisible}
        onRequestClose={() =>
          setPresetModalVisible(false)
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          <View style={styles.modal}>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >

              {/* Header */}

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Create Preset
                </Text>

                <Pressable
                  onPress={() =>
                    setPresetModalVisible(false)
                  }
                >
                  <Text style={styles.closeButton}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* Name */}

              <Text style={styles.inputLabel}>
                Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Daily Transpo"
                placeholderTextColor="#999"
                value={presetName}
                onChangeText={setPresetName}
              />

              {/* Amount */}

              <Text style={styles.inputLabel}>
                Amount
              </Text>

              <View style={styles.amountContainer}>
                <Text style={styles.currency}>
                  ₱
                </Text>

                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#AAAAAA"
                  keyboardType="decimal-pad"
                  value={presetAmount}
                  onChangeText={setPresetAmount}
                />
              </View>

              {/* Category */}

              <Text style={styles.inputLabel}>
                Category
              </Text>

              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const isSelected =
                    presetCategory ===
                    category.name;

                  return (
                    <Pressable
                      key={category.name}
                      style={[
                        styles.categoryButton,
                        isSelected &&
                          styles.categoryButtonSelected,
                      ]}
                      onPress={() =>
                        setPresetCategory(
                          category.name
                        )
                      }
                    >
                      <Text
                        style={
                          styles.categoryEmoji
                        }
                      >
                        {category.emoji}
                      </Text>

                      <Text
                        style={[
                          styles.categoryButtonText,
                          isSelected &&
                            styles.categoryButtonTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Notes */}

              <Text style={styles.inputLabel}>
                Notes{' '}
                <Text style={styles.optional}>
                  (Optional)
                </Text>
              </Text>

              <TextInput
                style={styles.notesInput}
                placeholder="e.g. Daily commute"
                placeholderTextColor="#999"
                multiline
                value={presetNotes}
                onChangeText={setPresetNotes}
                textAlignVertical="top"
              />

              {/* Save Preset */}

              <Pressable
                style={[
                  styles.saveButton,
                  (!presetName.trim() ||
                    !presetAmount ||
                    Number(presetAmount) <= 0) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={savePreset}
                disabled={
                  !presetName.trim() ||
                  !presetAmount ||
                  Number(presetAmount) <= 0
                }
              >
                <Text style={styles.saveButtonText}>
                  Save Preset
                </Text>
              </Pressable>

              {/* Cancel */}

              <Pressable
                style={styles.cancelButton}
                onPress={() =>
                  setPresetModalVisible(false)
                }
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </Pressable>

            </ScrollView>

          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
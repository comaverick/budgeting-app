import {
  useCallback,
  useState,
} from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import {
  getExpenses,
  getWeeklyGoal,
  setWeeklyGoal,
} from '../../database/database';

import { styles } from './index.styles';

type Expense = {
  id: number;
  amount: number;
  description: string;
  category: string;
  emoji: string;
  date: string;
  notes: string | null;
};

export default function HomeScreen() {
  // =========================
  // STATE
  // =========================

  const [expenses, setExpenses] = useState<Expense[]>(
    []
  );

  const [weeklyGoal, setWeeklyGoalState] =
    useState<number | null>(null);

  const [goalModalVisible, setGoalModalVisible] =
    useState(false);

  const [goalAmount, setGoalAmount] = useState('');

  // =========================
  // LOAD EXPENSES
  // =========================

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();

      setExpenses(data);
    } catch (error) {
      console.error(
        'Failed to load expenses:',
        error
      );
    }
  };

  // =========================
  // LOAD WEEKLY GOAL
  // =========================

  const loadWeeklyGoal = async () => {
    try {
      const goal = await getWeeklyGoal();

      if (goal) {
        setWeeklyGoalState(
          goal.weekly_limit
        );

        setGoalAmount(
          goal.weekly_limit.toString()
        );
      } else {
        setWeeklyGoalState(null);
        setGoalAmount('');
      }
    } catch (error) {
      console.error(
        'Failed to load weekly goal:',
        error
      );
    }
  };

  // =========================
  // REFRESH HOME
  // =========================

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
      loadWeeklyGoal();
    }, [])
  );

  // =========================
  // SAVE WEEKLY GOAL
  // =========================

  const saveWeeklyGoal = async () => {
    const amount = Number(goalAmount);

    if (!amount || amount <= 0) {
      return;
    }

    try {
      await setWeeklyGoal(amount);

      setWeeklyGoalState(amount);

      setGoalModalVisible(false);
    } catch (error) {
      console.error(
        'Failed to save weekly goal:',
        error
      );
    }
  };

  // =========================
  // DATES
  // =========================

  const today = new Date();

  const todayString =
    today.toISOString().split('T')[0];

  // Monday = first day of week
  const day = today.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  const weekStart = new Date(today);

  weekStart.setDate(
    today.getDate() + difference
  );

  const weekStartString =
    weekStart.toISOString().split('T')[0];

  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const monthStartString =
    monthStart.toISOString().split('T')[0];

  // =========================
  // FILTER EXPENSES
  // =========================

  const todayExpenses = expenses.filter(
    (expense) =>
      expense.date === todayString
  );

  const weekExpenses = expenses.filter(
    (expense) =>
      expense.date >= weekStartString &&
      expense.date <= todayString
  );

  const monthExpenses = expenses.filter(
    (expense) =>
      expense.date >= monthStartString &&
      expense.date <= todayString
  );

  // =========================
  // TOTALS
  // =========================

  const todayTotal = todayExpenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );

  const weekTotal = weekExpenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );

  const monthTotal = monthExpenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );

  // =========================
  // WEEKLY GOAL CALCULATIONS
  // =========================

  const weekProgress =
    weeklyGoal && weeklyGoal > 0
      ? Math.min(
          weekTotal / weeklyGoal,
          1
        )
      : 0;

  const remainingAmount = weeklyGoal
    ? weeklyGoal - weekTotal
    : 0;

  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals =
    monthExpenses.reduce(
      (result, expense) => {
        if (!result[expense.category]) {
          result[expense.category] = {
            amount: 0,
            emoji: expense.emoji,
          };
        }

        result[expense.category].amount +=
          expense.amount;

        return result;
      },
      {} as Record<
        string,
        {
          amount: number;
          emoji: string;
        }
      >
    );

  const topCategories = Object.entries(
    categoryTotals
  )
    .sort(
      ([, a], [, b]) =>
        b.amount - a.amount
    )
    .slice(0, 3);

  // =========================
  // FORMAT MONEY
  // =========================

  const formatMoney = (
    amount: number
  ) => {
    return `₱${amount.toLocaleString(
      'en-PH',
      {
        minimumFractionDigits: 2,
      }
    )}`;
  };

  // =========================
  // GREETING
  // =========================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  // =========================
  // DATE DISPLAY
  // =========================

  const formattedDate =
    today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  // =========================
  // UI
  // =========================

  return (
    <View style={styles.container}>
      <FlatList
        data={todayExpenses}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            {/* =========================
                HEADER
            ========================= */}

            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  {getGreeting()} 👋
                </Text>

                <Text style={styles.date}>
                  {formattedDate}
                </Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons
                  name="wallet-outline"
                  size={22}
                  color="#000"
                />
              </View>
            </View>

            {/* =========================
                TODAY
            ========================= */}

            <View style={styles.todayCard}>
              <View
                style={styles.todayHeader}
              >
                <Text
                  style={styles.todayLabel}
                >
                  TODAY
                </Text>

                <View
                  style={styles.todayIcon}
                >
                  <Ionicons
                    name="today-outline"
                    size={20}
                    color="#FFF"
                  />
                </View>
              </View>

              <Text
                style={styles.todayAmount}
              >
                {formatMoney(todayTotal)}
              </Text>

              <Text
                style={styles.todaySubtext}
              >
                {todayExpenses.length}{' '}
                {todayExpenses.length === 1
                  ? 'expense'
                  : 'expenses'}{' '}
                today
              </Text>
            </View>

            {/* =========================
                WEEK / MONTH
            ========================= */}

            <View style={styles.secondaryRow}>
              <View
                style={styles.secondaryCard}
              >
                <Text
                  style={styles.secondaryLabel}
                >
                  THIS WEEK
                </Text>

                <Text
                  style={styles.secondaryAmount}
                >
                  {formatMoney(weekTotal)}
                </Text>

                <Text
                  style={styles.secondarySubtext}
                >
                  {weekExpenses.length}{' '}
                  {weekExpenses.length === 1
                    ? 'expense'
                    : 'expenses'}
                </Text>
              </View>

              <View
                style={styles.secondaryCard}
              >
                <Text
                  style={styles.secondaryLabel}
                >
                  THIS MONTH
                </Text>

                <Text
                  style={styles.secondaryAmount}
                >
                  {formatMoney(monthTotal)}
                </Text>

                <Text
                  style={styles.secondarySubtext}
                >
                  {monthExpenses.length}{' '}
                  {monthExpenses.length === 1
                    ? 'expense'
                    : 'expenses'}
                </Text>
              </View>
            </View>

            {/* =========================
                WEEKLY GOAL
            ========================= */}

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View>
                  <Text
                    style={styles.goalTitle}
                  >
                    Weekly Goal
                  </Text>

                  <Text
                    style={styles.goalSubtitle}
                  >
                    {weeklyGoal
                      ? `${formatMoney(
                          weekTotal
                        )} of ${formatMoney(
                          weeklyGoal
                        )}`
                      : 'Set a weekly spending limit'}
                  </Text>
                </View>

                <Pressable
                  style={
                    styles.goalEditButton
                  }
                  onPress={() => {
                    if (weeklyGoal) {
                      setGoalAmount(
                        weeklyGoal.toString()
                      );
                    }

                    setGoalModalVisible(true);
                  }}
                >
                  <Ionicons
                    name={
                      weeklyGoal
                        ? 'pencil-outline'
                        : 'add'
                    }
                    size={20}
                    color="#111"
                  />
                </Pressable>
              </View>

              {weeklyGoal ? (
                <>
                  <View
                    style={
                      styles.goalProgressBackground
                    }
                  >
                    <View
                      style={[
                        styles.goalProgressFill,
                        {
                          width: `${weekProgress * 100}%`,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={styles.goalFooter}
                  >
                    <Text
                      style={styles.goalSpent}
                    >
                      {formatMoney(
                        weekTotal
                      )}{' '}
                      spent
                    </Text>

                    <Text
                      style={[
                        styles.goalRemaining,
                        remainingAmount < 0 &&
                          styles.goalOver,
                      ]}
                    >
                      {remainingAmount >= 0
                        ? `${formatMoney(
                            remainingAmount
                          )} remaining`
                        : `${formatMoney(
                            Math.abs(
                              remainingAmount
                            )
                          )} over`}
                    </Text>
                  </View>
                </>
              ) : (
                <Pressable
                  style={
                    styles.setGoalButton
                  }
                  onPress={() =>
                    setGoalModalVisible(
                      true
                    )
                  }
                >
                  <Text
                    style={
                      styles.setGoalText
                    }
                  >
                    Set Weekly Goal
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFF"
                  />
                </Pressable>
              )}
            </View>

            {/* =========================
                TODAY'S EXPENSES
            ========================= */}

            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                Today's Expenses
              </Text>

              <Text
                style={styles.expenseCount}
              >
                {todayExpenses.length}
              </Text>
            </View>

            {todayExpenses.length === 0 && (
              <View
                style={styles.emptyToday}
              >
                <Text
                  style={
                    styles.emptyTodayEmoji
                  }
                >
                  ✨
                </Text>

                <Text
                  style={
                    styles.emptyTodayTitle
                  }
                >
                  No spending today
                </Text>

                <Text
                  style={
                    styles.emptyTodayText
                  }
                >
                  You're off to a good start.
                </Text>
              </View>
            )}

            {/* =========================
                TOP CATEGORIES
            ========================= */}

            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                Top Categories
              </Text>
            </View>

            {topCategories.length === 0 ? (
              <View
                style={styles.emptyCard}
              >
                <Text
                  style={styles.emptyText}
                >
                  No spending this month yet.
                </Text>
              </View>
            ) : (
              <View
                style={styles.categoryCard}
              >
                {topCategories.map(
                  ([category, data]) => {
                    const percentage =
                      monthTotal > 0
                        ? data.amount /
                          monthTotal
                        : 0;

                    return (
                      <View
                        key={category}
                        style={
                          styles.categoryRow
                        }
                      >
                        <View
                          style={
                            styles.categoryInfo
                          }
                        >
                          <View
                            style={
                              styles.categoryIcon
                            }
                          >
                            <Text>
                              {data.emoji}
                            </Text>
                          </View>

                          <Text
                            style={
                              styles.categoryName
                            }
                          >
                            {category}
                          </Text>
                        </View>

                        <View
                          style={
                            styles.categoryRight
                          }
                        >
                          <Text
                            style={
                              styles.categoryAmount
                            }
                          >
                            {formatMoney(
                              data.amount
                            )}
                          </Text>

                          <View
                            style={
                              styles.progressBackground
                            }
                          >
                            <View
                              style={[
                                styles.progressFill,
                                {
                                  width: `${Math.max(
                                    percentage *
                                      100,
                                    3
                                  )}%`,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }
                )}
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View
              style={styles.expenseLeft}
            >
              <View
                style={styles.expenseIcon}
              >
                <Text
                  style={styles.expenseEmoji}
                >
                  {item.emoji}
                </Text>
              </View>

              <View>
                <Text
                  style={styles.expenseName}
                >
                  {item.description}
                </Text>

                <Text
                  style={styles.expenseCategory}
                >
                  {item.category}
                </Text>
              </View>
            </View>

            <Text
              style={styles.expenseAmount}
            >
              -{formatMoney(item.amount)}
            </Text>
          </View>
        )}
      />

      {/* =========================
          WEEKLY GOAL MODAL
      ========================= */}

      <Modal
        animationType="slide"
        transparent
        visible={goalModalVisible}
        onRequestClose={() =>
          setGoalModalVisible(false)
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
          <View style={styles.goalModal}>
            <View style={styles.modalHeader}>
              <Text
                style={styles.modalTitle}
              >
                Weekly Spending Goal
              </Text>

              <Pressable
                onPress={() =>
                  setGoalModalVisible(
                    false
                  )
                }
              >
                <Text
                  style={styles.closeButton}
                >
                  ✕
                </Text>
              </Pressable>
            </View>

            <Text
              style={styles.modalDescription}
            >
              Set the maximum amount you'd like
              to spend each week.
            </Text>

            <Text
              style={styles.inputLabel}
            >
              Weekly Goal
            </Text>

            <View
              style={styles.amountContainer}
            >
              <Text
                style={styles.currency}
              >
                ₱
              </Text>

              <TextInput
                style={styles.amountInput}
                placeholder="3,000"
                placeholderTextColor="#AAA"
                keyboardType="decimal-pad"
                value={goalAmount}
                onChangeText={setGoalAmount}
              />
            </View>

            <Pressable
              style={[
                styles.saveButton,
                (!goalAmount ||
                  Number(goalAmount) <= 0) &&
                  styles.saveButtonDisabled,
              ]}
              onPress={saveWeeklyGoal}
              disabled={
                !goalAmount ||
                Number(goalAmount) <= 0
              }
            >
              <Text
                style={styles.saveButtonText}
              >
                Save Goal
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                setGoalModalVisible(
                  false
                )
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
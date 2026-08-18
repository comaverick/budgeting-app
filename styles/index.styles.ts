import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ========================================
  // MAIN
  // ========================================

  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 27,
    fontWeight: '700',
    color: '#111111',
  },

  date: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ========================================
  // TODAY HERO CARD
  // ========================================

  todayCard: {
    backgroundColor: '#000000',
    borderRadius: 26,
    padding: 22,
    minHeight: 190,
    marginBottom: 14,
  },

  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  todayLabel: {
    color: '#AAAAAA',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },

  todayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  todayAmount: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '700',
    marginTop: 22,
  },

  todaySubtext: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 8,
  },

  // ========================================
  // WEEK / MONTH CARDS
  // ========================================

  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  secondaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    minHeight: 120,
  },

  secondaryLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  secondaryAmount: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 13,
  },

  secondarySubtext: {
    color: '#999999',
    fontSize: 12,
    marginTop: 5,
  },

  // ========================================
  // WEEKLY GOAL
  // ========================================

  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 30,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  goalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },

  goalSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  goalEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalProgressBackground: {
    height: 10,
    backgroundColor: '#E9E9E9',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
  },

  goalProgressFill: {
    height: '100%',
    backgroundColor: '#111111',
    borderRadius: 5,
  },

  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  goalSpent: {
    fontSize: 12,
    color: '#777777',
  },

  goalRemaining: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },

  goalOver: {
    color: '#FF3B30',
  },

  setGoalButton: {
    height: 45,
    backgroundColor: '#111111',
    borderRadius: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  setGoalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // ========================================
  // SECTION HEADER
  // ========================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  expenseCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9E9E9',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },

  // ========================================
  // TODAY EMPTY STATE
  // ========================================

  emptyToday: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 30,
  },

  emptyTodayEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },

  emptyTodayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },

  emptyTodayText: {
    color: '#999999',
    fontSize: 13,
    marginTop: 5,
  },

  // ========================================
  // EXPENSE CARD
  // ========================================

  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  expenseIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  expenseEmoji: {
    fontSize: 21,
  },

  expenseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  expenseCategory: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },

  expenseAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    marginLeft: 10,
  },

  // ========================================
  // TOP CATEGORIES
  // ========================================

  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 30,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },

  categoryRight: {
    width: 125,
    alignItems: 'flex-end',
  },

  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },

  progressBackground: {
    width: '100%',
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#111111',
    borderRadius: 3,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
  },

  emptyText: {
    color: '#999999',
    fontSize: 14,
  },

  // ========================================
  // WEEKLY GOAL MODAL
  // ========================================

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },

  goalModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 22,
    width: '100%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },

  closeButton: {
    fontSize: 20,
    color: '#777777',
  },

  modalDescription: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },

  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 58,
    marginBottom: 24,
  },

  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111111',
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#111111',
  },

  saveButton: {
    height: 52,
    backgroundColor: '#111111',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  saveButtonDisabled: {
    backgroundColor: '#D5D5D5',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  cancelButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#777777',
    fontSize: 15,
    fontWeight: '600',
  },
});
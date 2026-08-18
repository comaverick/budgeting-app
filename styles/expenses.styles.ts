import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 65,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
  },

  subtitle: {
    color: '#777',
    fontSize: 14,
    marginTop: 5,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
  },

  list: {
    paddingBottom: 120,
    flexGrow: 1,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },

  emptyEmoji: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  emptyText: {
    color: '#888',
    marginTop: 6,
  },

  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  emoji: {
    fontSize: 23,
  },

  expenseName: {
    fontSize: 16,
    fontWeight: '600',
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  category: {
    color: '#888',
    fontSize: 13,
  },

  date: {
    color: '#AAAAAA',
    fontSize: 13,
    marginLeft: 5,
  },

  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  swipeActions: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  paddingHorizontal: 10,
  marginBottom: 10,
},

editAction: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: '#E5E5EA',
  alignItems: 'center',
  justifyContent: 'center',
},

deleteAction: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: '#FF3B30',
  alignItems: 'center',
  justifyContent: 'center',
},

actionIcon: {
  fontSize: 22,
  marginBottom: 3,
},

editText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#3A4A5C',
},

deleteText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#D92D20',
},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    maxHeight: '92%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: '700',
  },

  closeButton: {
    fontSize: 20,
    color: '#777',
    padding: 5,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
  },

  optional: {
    color: '#999',
    fontWeight: '400',
  },

  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 8,
    marginBottom: 5,
  },

  currency: {
    fontSize: 32,
    fontWeight: '600',
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  categoryButton: {
    width: '23.5%',
    minHeight: 72,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  categoryButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  categoryEmoji: {
    fontSize: 22,
    marginBottom: 5,
  },

  categoryButtonText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  },

  categoryButtonTextSelected: {
    color: '#FFF',
  },

  dateInput: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 14,
  paddingHorizontal: 15,
  height: 64,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFF',
},

dateIcon: {
  fontSize: 22,
  marginRight: 12,
},

dateText: {
  fontSize: 17,
  color: '#222',
  flex: 1,
},

dateArrow: {
  fontSize: 28,
  color: '#888',
  marginLeft: 10,
},

calendarContainer: {
  backgroundColor: '#FFF',
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 18,
  marginTop: 6,
  padding: 16,
},

calendarHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 18,
},

monthButton: {
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
},

monthArrow: {
  fontSize: 32,
  color: '#111',
  fontWeight: '300',
},

monthTitle: {
  fontSize: 17,
  fontWeight: '700',
},

weekRow: {
  flexDirection: 'row',
  marginBottom: 8,
},

weekDay: {
  width: '14.285%',
  textAlign: 'center',
  fontSize: 11,
  fontWeight: '600',
  color: '#888',
},

daysGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
},

dayCell: {
  width: '14.285%',
  height: 42,
  alignItems: 'center',
  justifyContent: 'center',
},

dayCircle: {
  width: 34,
  height: 34,
  borderRadius: 17,
  alignItems: 'center',
  justifyContent: 'center',
},

selectedDay: {
  backgroundColor: '#000',
},

dayText: {
  fontSize: 15,
  color: '#222',
},

selectedDayText: {
  color: '#FFF',
  fontWeight: '600',
},

  notesInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    minHeight: 85,
  },

  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },

  saveButtonDisabled: {
    opacity: 0.35,
  },

  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    color: '#777',
  },
  quickAddSection: {
  marginBottom: 20,
},

quickAddHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

quickAddTitle: {
  fontSize: 20,
  fontWeight: '700',
},

managePresets: {
  fontSize: 14,
  color: '#777',
},

presetList: {
  gap: 10,
},

presetCard: {
  width: 110,
  height: 105,
  backgroundColor: '#FFF',
  borderRadius: 18,
  padding: 12,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E8E8E8',
},

presetEmoji: {
  fontSize: 25,
  marginBottom: 5,
},

presetName: {
  fontSize: 14,
  fontWeight: '600',
},

presetAmount: {
  fontSize: 12,
  color: '#777',
  marginTop: 3,
},noPresets: {
  width: 280,
  height: 80,
  borderRadius: 18,
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
},

noPresetsText: {
  color: '#888',
  fontSize: 13,
  textAlign: 'center',
},
});

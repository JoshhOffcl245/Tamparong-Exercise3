import React, { useState } from 'react'
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { QuizQuestion, useQuiz } from '../context/QuizContext'

export const QuizSettingsTab = () => {
  const { questions, timerSeconds, setTimerSeconds, addQuestion, editQuestion, deleteQuestion } = useQuiz()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<QuizQuestion>({
    id: 0,
    type: 'multiple',
    question: '',
    choices: { A: '', B: '', C: '', D: '' },
    answer: 'A',
  })

  const openAddForm = () => {
    setEditingId(null)
    setFormData({
      id: 0,
      type: 'multiple',
      question: '',
      choices: { A: '', B: '', C: '', D: '' },
      answer: 'A',
    })
    setModalVisible(true)
  }

  const openEditForm = (question: QuizQuestion) => {
    setEditingId(question.id)
    setFormData(question)
    setModalVisible(true)
  }

  const handleSave = () => {
    if (!formData.question.trim()) {
      Alert.alert('Error', 'Please enter a question')
      return
    }

    if (Object.values(formData.choices).some(choice => !choice.trim())) {
      Alert.alert('Error', 'Please fill in all choices')
      return
    }

    if (editingId !== null) {
      editQuestion(editingId, formData)
      Alert.alert('Success', 'Question updated')
    } else {
      addQuestion(formData)
      Alert.alert('Success', 'Question added')
    }

    setModalVisible(false)
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteQuestion(id)
            Alert.alert('Success', 'Question deleted')
          },
        },
      ]
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.timerSection}>
          <Text style={styles.sectionTitle}>Quiz Timer</Text>
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Limit: {formatTime(timerSeconds)}</Text>
            <View style={styles.timerButtonsContainer}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => setTimerSeconds(Math.max(0, timerSeconds - 60))}
              >
                <Text style={styles.timerButtonText}>- 1 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => setTimerSeconds(timerSeconds + 60)}
              >
                <Text style={styles.timerButtonText}>+ 1 min</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.questionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quiz Items ({questions.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={openAddForm}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {questions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No questions yet. Add one to get started!</Text>
            </View>
          ) : (
            questions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{index + 1}</Text>
                  <View style={styles.questionInfo}>
                    <Text style={styles.questionType}>{question.type.toUpperCase()}</Text>
                    <Text style={styles.questionText} numberOfLines={2}>
                      {question.question}
                    </Text>
                  </View>
                </View>

                <View style={styles.choicesPreview}>
                  {Object.entries(question.choices).map(([key]) => (
                    <Text key={key} style={styles.choicePreview}>{key}</Text>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => openEditForm(question)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(question.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Question' : 'Add Question'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Question Type</Text>
                <View style={styles.typeButtonsContainer}>
                  {(['multiple', 'truefalse', 'checkbox'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        formData.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          formData.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type === 'truefalse' ? 'True/False' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Question</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter the question"
                  placeholderTextColor="#666"
                  value={formData.question}
                  onChangeText={(text) => setFormData({ ...formData, question: text })}
                  multiline
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Choices</Text>
                {Object.entries(formData.choices).map(([key, value]) => (
                  <TextInput
                    key={key}
                    style={styles.choiceInput}
                    placeholder={`Choice ${key}`}
                    placeholderTextColor="#666"
                    value={value}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        choices: { ...formData.choices, [key]: text },
                      })
                    }
                  />
                ))}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Correct Answer</Text>
                {Array.isArray(formData.answer) ? (
                  <View style={styles.checkboxGroup}>
                    {Object.keys(formData.choices).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.checkboxItem}
                        onPress={() => {
                          const answers = formData.answer as string[]
                          const newAnswers = answers.includes(key)
                            ? answers.filter(a => a !== key)
                            : [...answers, key]
                          setFormData({ ...formData, answer: newAnswers })
                        }}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            (formData.answer as string[]).includes(key) && styles.checkboxChecked,
                          ]}
                        >
                          {(formData.answer as string[]).includes(key) && (
                            <Text style={styles.checkboxMark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.checkboxLabel}>{key}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.radioGroup}>
                    {Object.keys(formData.choices).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.radioItem}
                        onPress={() => setFormData({ ...formData, answer: key })}
                      >
                        <View
                          style={[
                            styles.radio,
                            formData.answer === key && styles.radioSelected,
                          ]}
                        >
                          {formData.answer === key && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>{key}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Question' : 'Add Question'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalBottomSpacer} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  timerSection: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 15,
    fontFamily: 'arial',
  },
  timerButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerButtonText: {
    color: '#e94560',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0f3460',
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e94560',
    marginRight: 12,
    minWidth: 25,
  },
  questionInfo: {
    flex: 1,
  },
  questionType: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  choicesPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  choicePreview: {
    backgroundColor: '#0f3460',
    color: '#e94560',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#0f3460',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#16213e',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#e94560',
  },
  formGroup: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 10,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0f3460',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#e94560',
  },
  typeButtonText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 12,
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#0f3460',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 50,
  },
  choiceInput: {
    backgroundColor: '#0f3460',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  checkboxGroup: {
    gap: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0f3460',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  checkboxMark: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  radioGroup: {
    gap: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0f3460',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#e94560',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e94560',
  },
  radioLabel: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBottomSpacer: {
    height: 20,
  },
})

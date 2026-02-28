import React, { createContext, useContext, useState } from 'react'

export interface QuizQuestion {
  id: number
  type: 'multiple' | 'truefalse' | 'checkbox'
  question: string
  choices: { [key: string]: string }
  answer: string | string[]
}

interface QuizContextType {
  questions: QuizQuestion[]
  setQuestions: (questions: QuizQuestion[]) => void
  timerSeconds: number
  setTimerSeconds: (seconds: number) => void
  addQuestion: (question: QuizQuestion) => void
  editQuestion: (id: number, question: QuizQuestion) => void
  deleteQuestion: (id: number) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      type: 'multiple',
      question: 'What does CPU stand for?',
      choices: {
        A: 'Central Process Unit',
        B: 'Central Processing Unit',
        C: 'Computer Personal Unit',
        D: 'Central Program Utility',
      },
      answer: 'B',
    },
    {
      id: 2,
      type: 'multiple',
      question: 'Which of the following is a programming language?',
      choices: {
        A: 'HTML',
        B: 'CSS',
        C: 'Python',
        D: 'HTTP',
      },
      answer: 'C',
    },
    {
      id: 3,
      type: 'multiple',
      question: 'What symbol is used for comments in Python?',
      choices: {
        A: '//',
        B: '<!-- -->',
        C: '#',
        D: '/* */',
      },
      answer: 'C',
    },
    {
      id: 4,
      type: 'truefalse',
      question: 'Boolean data type stores true or false values.',
      choices: {
        A: 'True',
        B: 'False',
      },
      answer: 'A',
    },
    {
      id: 5,
      type: 'multiple',
      question: 'What is the result of 2 + 3 * 2?',
      choices: {
        A: '10',
        B: '7',
        C: '12',
        D: '8',
      },
      answer: 'B',
    },
    {
      id: 6,
      type: 'multiple',
      question: 'Which keyword defines a function in Python?',
      choices: {
        A: 'func',
        B: 'function',
        C: 'define',
        D: 'def',
      },
      answer: 'D',
    },
    {
      id: 7,
      type: 'multiple',
      question: 'What does OOP stand for?',
      choices: {
        A: 'Object Oriented Programming',
        B: 'Open Object Protocol',
        C: 'Operational Object Process',
        D: 'Ordered Output Program',
      },
      answer: 'A',
    },
    {
      id: 8,
      type: 'multiple',
      question: 'Which loop is guaranteed to execute at least once?',
      choices: {
        A: 'for',
        B: 'while',
        C: 'do-while',
        D: 'foreach',
      },
      answer: 'C',
    },
    {
      id: 9,
      type: 'multiple',
      question: 'Which symbol is used for equality comparison in most languages?',
      choices: {
        A: '=',
        B: '==',
        C: '===',
        D: '!=',
      },
      answer: 'B',
    },
    {
      id: 10,
      type: 'multiple',
      question: 'What does IDE stand for?',
      choices: {
        A: 'Integrated Development Environment',
        B: 'Internal Design Engine',
        C: 'Integrated Debug Editor',
        D: 'Independent Development Environment',
      },
      answer: 'A',
    },
    {
      id: 11,
      type: 'checkbox',
      question: 'Which data structures use FIFO and LIFO?',
      choices: {
        A: 'Stack',
        B: 'Queue',
        C: 'Array',
        D: 'Tree',
      },
      answer: ['B', 'C'],
    },
    {
      id: 12,
      type: 'multiple',
      question: 'Which keyword is used to create a class in Python?',
      choices: {
        A: 'object',
        B: 'class',
        C: 'struct',
        D: 'define',
      },
      answer: 'B',
    },
    {
      id: 13,
      type: 'multiple',
      question: 'Which operator is used for logical AND?',
      choices: {
        A: '&',
        B: '&&',
        C: '|',
        D: '!',
      },
      answer: 'B',
    },
  ])
  const [timerSeconds, setTimerSeconds] = useState(300) // 5 minutes default

  const addQuestion = (question: QuizQuestion) => {
    const newQuestion = {
      ...question,
      id: Math.max(...questions.map(q => q.id), 0) + 1
    }
    setQuestions([...questions, newQuestion])
  }

  const editQuestion = (id: number, updatedQuestion: QuizQuestion) => {
    setQuestions(questions.map(q => q.id === id ? { ...updatedQuestion, id } : q))
  }

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <QuizContext.Provider
      value={{
        questions,
        setQuestions,
        timerSeconds,
        setTimerSeconds,
        addQuestion,
        editQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}

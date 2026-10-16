import { QuizQuestion } from '../types';

export const QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    subject: 'physics',
    category: 'kinematics',
    difficulty: 'Beginner',
    question: 'A ball is launched horizontally from a cliff. Neglecting air resistance, what happens to its horizontal velocity component during flight?',
    options: [
      'It increases constantly due to gravity',
      'It remains constant throughout the flight',
      'It decreases linearly to zero',
      'It fluctuates in a sinusoidal pattern'
    ],
    correctAnswerIndex: 1,
    explanation: 'Because gravity acts strictly in the vertical direction ($a_x = 0$), there is no horizontal acceleration. Thus, horizontal velocity remains constant.',
    formulaHint: 'a_x = 0 \\implies v_x = v_{0x}'
  },
  {
    id: 'q2',
    subject: 'physics',
    category: 'kinematics',
    difficulty: 'Beginner',
    question: 'At what launch angle relative to horizontal is the theoretical maximum range achieved on flat ground?',
    options: ['30 degrees', '45 degrees', '60 degrees', '90 degrees'],
    correctAnswerIndex: 1,
    explanation: 'The range formula is R = (v^2 * sin(2θ)) / g. The maximum value of sin(2θ) is 1, which occurs when 2θ = 90°, so θ = 45°.',
    formulaHint: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}'
  },
  {
    id: 'q3',
    subject: 'physics',
    category: 'dynamics',
    difficulty: 'Intermediate',
    question: 'If a net force of 50 N is applied to a 10 kg mass, what is its resulting acceleration?',
    options: ['0.2 m/s²', '5 m/s²', '500 m/s²', '10 m/s²'],
    correctAnswerIndex: 1,
    explanation: "Using Newton's Second Law: a = F / m = 50 N / 10 kg = 5 m/s².",
    formulaHint: 'F = m \\cdot a'
  },
  {
    id: 'q4',
    subject: 'maths',
    category: 'trigonometry',
    difficulty: 'Beginner',
    question: 'What is the exact value of sin(30°) or sin(π/6 rad)?',
    options: ['0.5', '0.7071 (√2/2)', '0.866 (√3/2)', '1.0'],
    correctAnswerIndex: 0,
    explanation: 'In a 30-60-90 right triangle, the side opposite the 30° angle is exactly half the length of the hypotenuse, giving sin(30°) = 0.5.',
    formulaHint: '\\sin(30^\\circ) = \\frac{1}{2}'
  },
  {
    id: 'q5',
    subject: 'maths',
    category: 'calculus',
    difficulty: 'Intermediate',
    question: 'What is the derivative of f(x) = 4x³ with respect to x?',
    options: ['12x²', '4x²', '12x³', '7x²'],
    correctAnswerIndex: 0,
    explanation: 'Using the Power Rule: d/dx [c * x^n] = c * n * x^(n-1). Here 4 * 3 * x^(3-1) = 12x².',
    formulaHint: '\\frac{d}{dx}[x^n] = n x^{n-1}'
  },
  {
    id: 'q6',
    subject: 'maths',
    category: 'geometry',
    difficulty: 'Beginner',
    question: 'In a right-angled triangle, if legs a = 3 and b = 4, what is the hypotenuse c?',
    options: ['5', '6', '7', '25'],
    correctAnswerIndex: 0,
    explanation: 'By the Pythagorean theorem: c = √(3² + 4²) = √(9 + 16) = √25 = 5.',
    formulaHint: 'a^2 + b^2 = c^2'
  }
];

import { Formula } from '../types';

export const FORMULAS: Formula[] = [
  {
    id: 'f-kin-1',
    name: 'Velocity-Time Equation',
    subject: 'physics',
    category: 'kinematics',
    expression: 'v = u + a * t',
    description: 'Calculates final velocity (v) based on initial velocity (u), acceleration (a), and time (t).',
    variables: [
      { symbol: 'v', name: 'Final Velocity', unit: 'm/s' },
      { symbol: 'u', name: 'Initial Velocity', unit: 'm/s' },
      { symbol: 'a', name: 'Acceleration', unit: 'm/s²' },
      { symbol: 't', name: 'Time elapsed', unit: 's' }
    ]
  },
  {
    id: 'f-kin-2',
    name: 'Displacement Kinematic Equation',
    subject: 'physics',
    category: 'kinematics',
    expression: 's = u*t + 0.5*a*t^2',
    description: 'Calculates total distance/displacement (s) traveled during uniform acceleration.',
    variables: [
      { symbol: 's', name: 'Displacement', unit: 'm' },
      { symbol: 'u', name: 'Initial Velocity', unit: 'm/s' },
      { symbol: 'a', name: 'Acceleration', unit: 'm/s²' },
      { symbol: 't', name: 'Time elapsed', unit: 's' }
    ]
  },
  {
    id: 'f-dyn-1',
    name: "Newton's Second Law",
    subject: 'physics',
    category: 'dynamics',
    expression: 'F = m * a',
    description: 'Relates net force (F) on an object to its mass (m) and acceleration (a).',
    variables: [
      { symbol: 'F', name: 'Force', unit: 'N' },
      { symbol: 'm', name: 'Mass', unit: 'kg' },
      { symbol: 'a', name: 'Acceleration', unit: 'm/s²' }
    ]
  },
  {
    id: 'f-eng-1',
    name: 'Kinetic Energy',
    subject: 'physics',
    category: 'energy',
    expression: 'KE = 0.5 * m * v^2',
    description: 'Energy possessed by a body due to its velocity.',
    variables: [
      { symbol: 'KE', name: 'Kinetic Energy', unit: 'J' },
      { symbol: 'm', name: 'Mass', unit: 'kg' },
      { symbol: 'v', name: 'Velocity', unit: 'm/s' }
    ]
  },
  {
    id: 'f-alg-1',
    name: 'Quadratic Formula',
    subject: 'maths',
    category: 'algebra',
    expression: 'x = (-b ± √(b² - 4ac)) / (2a)',
    description: 'Solves quadratic equations of the form ax² + bx + c = 0.',
    variables: [
      { symbol: 'a', name: 'Coefficient a', unit: '' },
      { symbol: 'b', name: 'Coefficient b', unit: '' },
      { symbol: 'c', name: 'Constant c', unit: '' }
    ]
  },
  {
    id: 'f-geo-1',
    name: 'Pythagorean Theorem',
    subject: 'maths',
    category: 'geometry',
    expression: 'c = √(a² + b²)',
    description: 'Calculates the hypotenuse c of a right-angled triangle from leg lengths a and b.',
    variables: [
      { symbol: 'a', name: 'Leg a', unit: 'm' },
      { symbol: 'b', name: 'Leg b', unit: 'm' },
      { symbol: 'c', name: 'Hypotenuse c', unit: 'm' }
    ]
  }
];

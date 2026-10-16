import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'kinematics-101',
    title: 'Projectile Motion & Kinematics',
    subject: 'physics',
    category: 'kinematics',
    readTime: '6 min read',
    difficulty: 'Beginner',
    summary: 'Master two-dimensional motion under the influence of gravity, decomposing velocity into horizontal and vertical components.',
    content: {
      overview: 'Projectile motion occurs when an object is thrown into the air and moves along a curved path under the action of gravity. Assuming negligible air resistance, the horizontal velocity remains constant, while vertical velocity experiences uniform acceleration downwards ($g \\approx 9.81\\, m/s^2$).',
      keyConcepts: [
        'Independence of horizontal ($x$) and vertical ($y$) motion components.',
        'Horizontal velocity: $v_x = v_0 \\cos(\\theta)$ (Constant acceleration $a_x = 0$).',
        'Vertical velocity: $v_y = v_0 \\sin(\\theta) - gt$ (Acceleration $a_y = -g$).',
        'Maximum height is achieved when vertical velocity $v_y = 0$.'
      ],
      equations: [
        {
          name: 'Horizontal Displacement',
          latex: 'x(t) = v_0 \\cdot \\cos(\\theta) \\cdot t',
          explanation: 'Distance traveled horizontally in time t.'
        },
        {
          name: 'Vertical Position',
          latex: 'y(t) = h_0 + v_0 \\cdot \\sin(\\theta) \\cdot t - \\frac{1}{2}g t^2',
          explanation: 'Height above ground at time t.'
        },
        {
          name: 'Total Range (from ground)',
          latex: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
          explanation: 'Maximum horizontal distance when launched and landed at equal heights.'
        }
      ],
      realWorldExample: 'A basketball shot, an artillery shell trajectory, or a soccer kick over a defensive wall all follow parabolic projectile trajectories.',
      interactiveParams: [
        { name: 'Launch Speed', symbol: 'v_0', min: 5, max: 100, step: 1, defaultVal: 30, unit: 'm/s', description: 'Initial velocity' },
        { name: 'Launch Angle', symbol: 'θ', min: 0, max: 90, step: 1, defaultVal: 45, unit: 'deg', description: 'Angle relative to horizon' },
        { name: 'Gravity', symbol: 'g', min: 1.6, max: 24.8, step: 0.1, defaultVal: 9.8, unit: 'm/s²', description: 'Gravitational field strength' }
      ],
      computeResult: (p) => {
        const rad = (p.launchAngle || p['Launch Angle'] || 45) * (Math.PI / 180);
        const v0 = p.launchSpeed || p['Launch Speed'] || 30;
        const g = p.gravity || p['Gravity'] || 9.8;
        const tFlight = (2 * v0 * Math.sin(rad)) / g;
        const range = (v0 * v0 * Math.sin(2 * rad)) / g;
        const maxHeight = (Math.pow(v0 * Math.sin(rad), 2)) / (2 * g);
        return [
          { label: 'Flight Duration', value: tFlight.toFixed(2), unit: 's' },
          { label: 'Max Range', value: range.toFixed(2), unit: 'm' },
          { label: 'Peak Altitude', value: maxHeight.toFixed(2), unit: 'm' }
        ];
      }
    }
  },
  {
    id: 'newtons-laws',
    title: "Newton's Laws of Motion & Forces",
    subject: 'physics',
    category: 'dynamics',
    readTime: '8 min read',
    difficulty: 'Beginner',
    summary: 'Discover how forces govern the movement of objects, from inertia to equal and opposite reactions.',
    content: {
      overview: "Isaac Newton's three laws of motion form the foundation of classical mechanics. They describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
      keyConcepts: [
        "First Law (Inertia): An object remains at rest or in uniform motion unless acted upon by a net external force.",
        "Second Law ($F = ma$): Acceleration is directly proportional to net force and inversely proportional to mass.",
        "Third Law (Action-Reaction): For every action force, there is an equal and opposite reaction force."
      ],
      equations: [
        {
          name: "Newton's Second Law",
          latex: 'F_{net} = m \\cdot a',
          explanation: 'Net force equals mass times acceleration.'
        },
        {
          name: 'Frictional Force',
          latex: 'F_f = \\mu \\cdot N',
          explanation: 'Friction depends on coefficient of friction and normal force.'
        }
      ],
      realWorldExample: 'A rocket launches into space by pushing hot exhaust gas downward (action), which accelerates the rocket upward (reaction).',
      interactiveParams: [
        { name: 'Applied Force', symbol: 'F', min: 0, max: 500, step: 5, defaultVal: 100, unit: 'N', description: 'Net pushing force' },
        { name: 'Mass', symbol: 'm', min: 1, max: 100, step: 1, defaultVal: 20, unit: 'kg', description: 'Mass of the object' }
      ],
      computeResult: (p) => {
        const F = p['Applied Force'] || 100;
        const m = p['Mass'] || 20;
        const a = F / m;
        return [
          { label: 'Resulting Acceleration', value: a.toFixed(2), unit: 'm/s²' }
        ];
      }
    }
  },
  {
    id: 'trigonometry-unit-circle',
    title: 'Trigonometry & Unit Circle Dynamics',
    subject: 'maths',
    category: 'trigonometry',
    readTime: '7 min read',
    difficulty: 'Beginner',
    summary: 'Understand sine, cosine, tangent, and radian angles through the geometry of the unit circle.',
    content: {
      overview: 'The unit circle is a circle of radius 1 centered at the origin (0,0) in the Cartesian coordinate system. It bridges geometric triangles with periodic trigonometric functions.',
      keyConcepts: [
        'For any angle θ, coordinates on the unit circle are $(x, y) = (\\cos\\theta, \\sin\\theta)$.',
        'Tangent is the ratio: $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.',
        'Fundamental identity: $\\sin^2\\theta + \\cos^2\\theta = 1$.',
        'Radians convert degrees: $\\text{rad} = \\text{deg} \\times \\frac{\\pi}{180}$.'
      ],
      equations: [
        {
          name: 'Pythagorean Trigonometric Identity',
          latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
          explanation: 'Derived directly from the Pythagorean theorem on the unit circle.'
        },
        {
          name: 'Law of Sines',
          latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
          explanation: 'Relates side lengths of any triangle to the sines of its angles.'
        }
      ],
      realWorldExample: 'Audio wave synthesis, AC electric current modeling, and GPS satellite triangulation all rely heavily on unit circle trigonometry.',
      interactiveParams: [
        { name: 'Angle', symbol: 'θ', min: 0, max: 360, step: 1, defaultVal: 60, unit: 'deg', description: 'Angle in degrees' }
      ],
      computeResult: (p) => {
        const deg = p['Angle'] || 60;
        const rad = deg * (Math.PI / 180);
        return [
          { label: 'sin(θ)', value: Math.sin(rad).toFixed(4), unit: '' },
          { label: 'cos(θ)', value: Math.cos(rad).toFixed(4), unit: '' },
          { label: 'tan(θ)', value: Math.abs(Math.cos(rad)) < 0.0001 ? 'Undefined' : Math.tan(rad).toFixed(4), unit: '' },
          { label: 'Angle in Radians', value: rad.toFixed(4), unit: 'rad' }
        ];
      }
    }
  },
  {
    id: 'calculus-derivatives',
    title: 'Differential Calculus & Rates of Change',
    subject: 'maths',
    category: 'calculus',
    readTime: '10 min read',
    difficulty: 'Intermediate',
    summary: 'Learn how derivatives calculate instantaneous rates of change, velocity from position, and curves tangents.',
    content: {
      overview: 'Calculus studies continuous change. Differential calculus focuses on the concept of the derivative, representing the rate at which a quantity changes at a given instant.',
      keyConcepts: [
        'The derivative $f\'(x)$ is the slope of the tangent line to $f(x)$ at $x$.',
        'Power Rule: $\\frac{d}{dx}[x^n] = n x^{n-1}$.',
        'Physics connection: Velocity $v(t) = \\frac{ds}{dt}$, Acceleration $a(t) = \\frac{dv}{dt}$.'
      ],
      equations: [
        {
          name: 'Limit Definition of Derivative',
          latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
          explanation: 'Fundamental mathematical foundation of differential calculus.'
        },
        {
          name: 'Product Rule',
          latex: '(u \\cdot v)\' = u\'v + uv\'',
          explanation: 'Derivative of the product of two functions.'
        }
      ],
      realWorldExample: 'Optimizing corporate profits, computing instantaneous vehicle speed, and training machine learning neural networks via gradient descent.',
      interactiveParams: [
        { name: 'Power n', symbol: 'n', min: 1, max: 5, step: 1, defaultVal: 3, unit: '', description: 'Polynomial power in x^n' },
        { name: 'Point x', symbol: 'x_0', min: -10, max: 10, step: 0.5, defaultVal: 2, unit: '', description: 'Evaluation point' }
      ],
      computeResult: (p) => {
        const n = p['Power n'] || 3;
        const x = p['Point x'] || 2;
        const val = Math.pow(x, n);
        const slope = n * Math.pow(x, n - 1);
        return [
          { label: `f(${x}) = ${x}^${n}`, value: val.toFixed(2), unit: '' },
          { label: `f'(${x}) = ${n}·${x}^${n-1}`, value: slope.toFixed(2), unit: 'slope' }
        ];
      }
    }
  }
];

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string[];
  interactiveType?: 'regression-canvas' | 'slope-intercept' | 'cost-function' | 'gradient-descent' | 'training' | 'failure-cases' | 'comparison';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const curriculum: Module[] = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Discover what Linear Regression is and why it matters',
    icon: '🎯',
    color: '#6366f1',
    lessons: [
      {
        id: 'what-is-lr',
        title: 'What is Linear Regression?',
        description: 'Understanding the foundation of predictive modeling',
        content: [
          'Linear Regression is one of the most fundamental algorithms in machine learning. It finds the best straight line that fits your data.',
          'Imagine you want to predict apartment prices in Cairo based on their size. You collect data — sizes and prices — and Linear Regression draws the best line through those points.',
          'This line becomes your prediction machine: give it any apartment size, and it tells you the estimated price.',
          'Linear Regression is the building block of neural networks. Every neuron in an ANN starts with a linear transformation before applying an activation function.',
        ],
        interactiveType: 'regression-canvas',
      },
      {
        id: 'why-lr',
        title: 'Why Do We Need It?',
        description: 'Real-world applications and importance',
        content: [
          'Linear Regression helps us find patterns in data and make predictions. It is used everywhere:',
          '🏠 Real Estate: Predicting house prices based on features like size, location, bedrooms.',
          '📈 Finance: Forecasting stock trends, revenue projections, risk assessment.',
          '🏥 Healthcare: Predicting patient outcomes, drug dosage optimization.',
          '🌤️ Weather: Temperature forecasting based on historical patterns.',
          'It is also the first step in understanding neural networks — every neuron computes y = wx + b before activation.',
        ],
      },
    ],
  },
  {
    id: 'math',
    title: 'The Mathematics',
    description: 'Master the equation behind the line',
    icon: '📐',
    color: '#a855f7',
    lessons: [
      {
        id: 'equation-of-line',
        title: 'Equation of a Line',
        description: 'Understanding y = mx + b',
        content: [
          'Every straight line can be described by: y = mx + b',
          'm is the SLOPE — it controls how steep the line is. A positive slope means the line goes up; negative means it goes down.',
          'b is the INTERCEPT — where the line crosses the y-axis. It shifts the entire line up or down.',
          'In machine learning, we write it as: ŷ = wx + b, where w is the weight (slope) and b is the bias (intercept).',
          'Use the sliders below to see how changing slope and intercept affects the line in real time!',
        ],
        interactiveType: 'slope-intercept',
      },
      {
        id: 'predictions',
        title: 'Making Predictions',
        description: 'How the model uses the equation',
        content: [
          'Once we have our line equation ŷ = wx + b, making predictions is simple:',
          '1. Take a new input value x (e.g., apartment size = 120 m²)',
          '2. Multiply by weight w: wx',
          '3. Add bias b: wx + b = ŷ',
          '4. ŷ is your prediction (estimated price)',
          'The challenge is finding the BEST values for w and b — the values that make predictions closest to reality.',
        ],
      },
    ],
  },
  {
    id: 'cost',
    title: 'Cost Function',
    description: 'Measuring how wrong the model is',
    icon: '📊',
    color: '#06b6d4',
    lessons: [
      {
        id: 'error',
        title: 'Understanding Error',
        description: 'The gap between prediction and reality',
        content: [
          'Error = Actual Value - Predicted Value',
          'For each data point, the error is the vertical distance between the point and our line.',
          'If our line predicts ŷ = 500,000 EGP but the actual price is 600,000 EGP, our error is 100,000.',
          'We need a way to measure the TOTAL error across ALL data points — that is the Cost Function.',
        ],
        interactiveType: 'cost-function',
      },
      {
        id: 'mse',
        title: 'Mean Squared Error',
        description: 'The standard measure of model performance',
        content: [
          'MSE = (1/n) × Σ(yᵢ - ŷᵢ)²',
          'We square each error because: negative and positive errors should not cancel out, and larger errors should be penalized more.',
          'We average (divide by n) to make it independent of dataset size.',
          'Lower MSE = Better model. MSE of 0 means perfect predictions (rarely possible with real data).',
          'Drag the regression line away from the data points below and watch the MSE increase!',
        ],
        interactiveType: 'cost-function',
      },
    ],
  },
  {
    id: 'gradient',
    title: 'Gradient Descent',
    description: 'The optimization algorithm that learns',
    icon: '⛰️',
    color: '#10b981',
    lessons: [
      {
        id: 'optimization',
        title: 'Finding the Minimum',
        description: 'How the algorithm navigates the loss landscape',
        content: [
          'Imagine standing on a mountain blindfolded. Your goal: reach the lowest valley. How?',
          'You feel the ground slope beneath your feet and take a step DOWNHILL. Repeat until flat ground.',
          'That is Gradient Descent! The "mountain" is the loss surface — a landscape where height = error.',
          'The gradient (slope of the loss) tells us which direction to move. We step in the OPPOSITE direction to go downhill.',
          'Watch the ball roll down the loss surface below. The learning rate controls how big each step is!',
        ],
        interactiveType: 'gradient-descent',
      },
      {
        id: 'learning-rate',
        title: 'Learning Rate',
        description: 'The most important hyperparameter',
        content: [
          'The learning rate (α) controls step size during optimization.',
          '⚡ Too HIGH: The ball overshoots the minimum, bouncing back and forth. May never converge!',
          '🐌 Too LOW: The ball creeps slowly. Takes forever to reach the minimum.',
          '✅ Just RIGHT: Smooth convergence to the optimal solution.',
          'Finding the right learning rate is one of the most important skills in machine learning.',
          'Experiment with the learning rate slider below to see these effects in real time!',
        ],
        interactiveType: 'gradient-descent',
      },
    ],
  },
  {
    id: 'training',
    title: 'Training Process',
    description: 'Watch the model learn step by step',
    icon: '🏋️',
    color: '#f59e0b',
    lessons: [
      {
        id: 'epochs',
        title: 'Training Loop',
        description: 'Epochs, updates, and convergence',
        content: [
          'Training happens in EPOCHS — each epoch is one complete pass through all the data.',
          'In each epoch: 1) Make predictions, 2) Calculate error, 3) Compute gradient, 4) Update weights',
          'Epoch after epoch, the line fits the data better and the loss decreases.',
          'Press the Train button below to watch the regression line slowly fit the data points!',
          'The loss graph on the right updates in real time — you will see it drop as the model learns.',
        ],
        interactiveType: 'training',
      },
    ],
  },
  {
    id: 'failures',
    title: 'Failure Cases',
    description: 'When Linear Regression breaks',
    icon: '⚠️',
    color: '#ef4444',
    lessons: [
      {
        id: 'failure-modes',
        title: 'When Lines Fail',
        description: 'Understanding model limitations',
        content: [
          'Linear Regression is powerful but NOT perfect. It fails in several common scenarios:',
          '🔄 Nonlinear Data: If the true relationship is curved, a straight line cannot capture it.',
          '🎯 Outliers: Extreme values pull the line away from the majority of points.',
          '📉 Underfitting: The model is too simple to capture the pattern (e.g., using a line for quadratic data).',
          '📈 Overfitting: Adding too many features makes the model memorize noise instead of learning patterns.',
          '🌊 Noisy Data: Heavy noise makes it hard to find any clear pattern.',
          'Toggle the controls below to ADD outliers, noise, or nonlinear patterns and watch the regression fail!',
        ],
        interactiveType: 'failure-cases',
      },
    ],
  },
  {
    id: 'comparison',
    title: 'Comparison',
    description: 'How Linear Regression compares to other methods',
    icon: '🔀',
    color: '#ec4899',
    lessons: [
      {
        id: 'compare-methods',
        title: 'Method Comparison',
        description: 'Linear vs Polynomial vs Neural Networks',
        content: [
          'Linear Regression is just one tool. Here is how it compares:',
          '📏 Linear Regression: Simple, fast, interpretable. Works for linear relationships. y = wx + b',
          '🔄 Polynomial Regression: Can capture curves. More flexible but can overfit. y = w₁x + w₂x² + ... + b',
          '🧠 Neural Networks: The most powerful. Can learn any pattern. Multiple layers of y = activation(wx + b).',
          'Compare them side-by-side below with the same dataset!',
        ],
        interactiveType: 'comparison',
      },
    ],
  },
];

export function getModule(moduleId: string): Module | undefined {
  return curriculum.find(m => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  const mod = getModule(moduleId);
  return mod?.lessons.find(l => l.id === lessonId);
}

export function getNextLesson(moduleId: string, lessonId: string): { moduleId: string; lessonId: string } | null {
  const modIndex = curriculum.findIndex(m => m.id === moduleId);
  if (modIndex === -1) return null;

  const mod = curriculum[modIndex];
  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId);

  if (lessonIndex < mod.lessons.length - 1) {
    return { moduleId, lessonId: mod.lessons[lessonIndex + 1].id };
  }

  if (modIndex < curriculum.length - 1) {
    const nextMod = curriculum[modIndex + 1];
    return { moduleId: nextMod.id, lessonId: nextMod.lessons[0].id };
  }

  return null;
}

export function getPrevLesson(moduleId: string, lessonId: string): { moduleId: string; lessonId: string } | null {
  const modIndex = curriculum.findIndex(m => m.id === moduleId);
  if (modIndex === -1) return null;

  const mod = curriculum[modIndex];
  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId);

  if (lessonIndex > 0) {
    return { moduleId, lessonId: mod.lessons[lessonIndex - 1].id };
  }

  if (modIndex > 0) {
    const prevMod = curriculum[modIndex - 1];
    return { moduleId: prevMod.id, lessonId: prevMod.lessons[prevMod.lessons.length - 1].id };
  }

  return null;
}

export function getTotalLessons(): number {
  return curriculum.reduce((acc, m) => acc + m.lessons.length, 0);
}

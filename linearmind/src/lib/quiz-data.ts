export interface QuizQuestion {
  id: string;
  moduleId: string;
  type: 'conceptual' | 'visual' | 'scenario' | 'prediction';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'intro',
    type: 'conceptual',
    question: 'What does Linear Regression try to find?',
    options: [
      'The average of all data points',
      'The best straight line that fits the data',
      'The maximum value in the dataset',
      'Clusters in the data',
    ],
    correctIndex: 1,
    explanation: 'Linear Regression finds the best straight line (y = wx + b) that minimizes the distance between predictions and actual values.',
  },
  {
    id: 'q2',
    moduleId: 'math',
    type: 'conceptual',
    question: 'In the equation y = mx + b, what does "m" represent?',
    options: [
      'The y-intercept',
      'The mean of the data',
      'The slope of the line',
      'The number of data points',
    ],
    correctIndex: 2,
    explanation: 'The slope (m) determines how steep the line is. A positive slope means y increases as x increases.',
  },
  {
    id: 'q3',
    moduleId: 'math',
    type: 'prediction',
    question: 'If y = 3x + 2, what is the predicted value when x = 4?',
    options: ['10', '12', '14', '16'],
    correctIndex: 2,
    explanation: 'y = 3(4) + 2 = 12 + 2 = 14',
  },
  {
    id: 'q4',
    moduleId: 'cost',
    type: 'conceptual',
    question: 'Why do we SQUARE the errors in MSE instead of just summing them?',
    options: [
      'To make computation faster',
      'Because squared numbers are always positive',
      'So positive and negative errors do not cancel out, and large errors are penalized more',
      'It is just a convention with no mathematical reason',
    ],
    correctIndex: 2,
    explanation: 'Squaring prevents cancellation of positive/negative errors and penalizes larger errors disproportionately, making the model prioritize reducing big mistakes.',
  },
  {
    id: 'q5',
    moduleId: 'cost',
    type: 'visual',
    question: 'If you drag the regression line far away from the data points, what happens to the MSE?',
    options: [
      'It stays the same',
      'It decreases',
      'It increases dramatically',
      'It becomes negative',
    ],
    correctIndex: 2,
    explanation: 'Moving the line away increases the distance (error) to each point. Since errors are squared, the MSE increases dramatically.',
  },
  {
    id: 'q6',
    moduleId: 'gradient',
    type: 'conceptual',
    question: 'What happens if the learning rate is TOO HIGH?',
    options: [
      'The model converges faster',
      'The model overshoots the minimum and may never converge',
      'The model underfits',
      'Nothing changes',
    ],
    correctIndex: 1,
    explanation: 'A learning rate that is too high causes the optimization to take steps that are too large, overshooting the minimum and potentially diverging.',
  },
  {
    id: 'q7',
    moduleId: 'gradient',
    type: 'scenario',
    question: 'You are training a model and the loss keeps bouncing up and down without decreasing. What is the most likely cause?',
    options: [
      'The dataset is too small',
      'The learning rate is too high',
      'The model needs more features',
      'The bias term is wrong',
    ],
    correctIndex: 1,
    explanation: 'Oscillating loss typically indicates a learning rate that is too large. The optimizer is overshooting the minimum on each step.',
  },
  {
    id: 'q8',
    moduleId: 'training',
    type: 'conceptual',
    question: 'What is one "epoch" in the training process?',
    options: [
      'One update to the weights',
      'One complete pass through the entire dataset',
      'One prediction',
      'One gradient calculation',
    ],
    correctIndex: 1,
    explanation: 'An epoch is one complete pass through all training data. Multiple epochs are needed for the model to converge.',
  },
  {
    id: 'q9',
    moduleId: 'failures',
    type: 'scenario',
    question: 'A dataset contains a clear quadratic (curved) relationship. You apply Linear Regression. What happens?',
    options: [
      'It fits perfectly',
      'It underfits — the straight line cannot capture the curve',
      'It overfits',
      'The MSE becomes zero',
    ],
    correctIndex: 1,
    explanation: 'A straight line cannot capture a curved relationship. The model will underfit, producing high error on both training and test data.',
  },
  {
    id: 'q10',
    moduleId: 'failures',
    type: 'scenario',
    question: 'A dataset has one extreme outlier (a point far from all others). What effect does it have on the regression line?',
    options: [
      'No effect at all',
      'It pulls the line toward the outlier, distorting predictions for other points',
      'It improves the model accuracy',
      'It only affects the intercept',
    ],
    correctIndex: 1,
    explanation: 'MSE heavily penalizes large errors, so the optimizer will try to reduce the distance to the outlier, pulling the entire line toward it and hurting predictions for normal points.',
  },
  {
    id: 'q11',
    moduleId: 'comparison',
    type: 'conceptual',
    question: 'What is the key advantage of Linear Regression over Neural Networks?',
    options: [
      'It is more accurate',
      'It can handle nonlinear data',
      'It is simpler, faster, and more interpretable',
      'It requires more data',
    ],
    correctIndex: 2,
    explanation: 'Linear Regression is simple, fast to train, and easy to interpret. Neural Networks are more powerful but act as "black boxes" and require more data.',
  },
  {
    id: 'q12',
    moduleId: 'comparison',
    type: 'prediction',
    question: 'Which method should you try FIRST for a dataset with a clear linear trend?',
    options: [
      'Deep Neural Network',
      'Random Forest',
      'Linear Regression',
      'Convolutional Neural Network',
    ],
    correctIndex: 2,
    explanation: 'Always start simple! If the data is linear, Linear Regression will be fast, accurate, and interpretable. Only use complex models when simple ones fail.',
  },
  {
    id: 'q13',
    moduleId: 'gradient',
    type: 'conceptual',
    question: 'In Gradient Descent, the gradient tells us:',
    options: [
      'The exact location of the minimum',
      'The direction of steepest INCREASE of the loss',
      'The learning rate to use',
      'How many epochs are needed',
    ],
    correctIndex: 1,
    explanation: 'The gradient points in the direction of steepest increase. We move in the OPPOSITE direction (negative gradient) to decrease the loss.',
  },
  {
    id: 'q14',
    moduleId: 'failures',
    type: 'prediction',
    question: 'Adding heavy random noise to a dataset will likely cause:',
    options: [
      'The MSE to decrease',
      'Perfect predictions',
      'Higher MSE and less reliable predictions',
      'The model to overfit',
    ],
    correctIndex: 2,
    explanation: 'Random noise obscures the true pattern, making it harder for the model to find a good fit. This results in higher MSE and less reliable predictions.',
  },
  {
    id: 'q15',
    moduleId: 'cost',
    type: 'conceptual',
    question: 'An MSE of 0 means:',
    options: [
      'The model is terrible',
      'The model perfectly predicts every data point',
      'The model has not been trained yet',
      'There is a bug in the code',
    ],
    correctIndex: 1,
    explanation: 'MSE = 0 means every prediction exactly matches the actual value. This is rare with real data and may indicate overfitting if the data has noise.',
  },
];

export function getQuizByModule(moduleId: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.moduleId === moduleId);
}

export function getQuizTypeLabel(type: QuizQuestion['type']): string {
  const labels = {
    conceptual: '💡 Conceptual',
    visual: '👁️ Visual',
    scenario: '🎬 Scenario',
    prediction: '🔮 Prediction',
  };
  return labels[type];
}

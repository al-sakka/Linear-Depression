export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string[];
  interactiveType?: 'regression-canvas' | 'slope-intercept' | 'cost-function' | 'gradient-descent' | 'gradient-descent-3d' | 'training' | 'failure-cases' | 'comparison' | 'multivariate' | 'feature-scaling' | 'correlation' | 'bias-variance' | 'metrics' | 'neuron-bridge' | 'loss-landscape' | 'residuals';
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
          'Linear Regression is one of the most fundamental algorithms in machine learning and statistics. At its core, it answers a simple question: given some input data, can we draw the best straight line that captures the relationship?',
          'Think of it like this: you collect data about apartments in your city — their sizes and prices. When you plot this data, you notice a trend: bigger apartments tend to cost more. Linear Regression finds the BEST line that captures this trend.',
          'Why "best"? Because infinitely many lines could pass through a cloud of points. Linear Regression finds the ONE line that minimizes the total prediction error across all points.',
          'This line becomes your prediction machine: give it any apartment size, and it outputs the estimated price. The math is beautifully simple: ŷ = wx + b, where w (weight) controls the slope and b (bias) is the starting point.',
          'Linear Regression is not just a "beginner" algorithm — it is the building block of neural networks. Every single neuron in a deep learning model starts with this exact linear transformation y = wx + b before applying an activation function. Master this, and you understand the DNA of AI.',
          'Click on the canvas below to add data points and watch the regression line update in real time!',
        ],
        interactiveType: 'regression-canvas',
      },
      {
        id: 'why-lr',
        title: 'Why Do We Need It?',
        description: 'Real-world applications and importance',
        content: [
          'Linear Regression is not just an academic exercise — it powers decisions worth billions of dollars every single day. Here is where you will find it in the real world:',
          '🏠 Real Estate: Zillow, Bayut, and Property Finder use regression models (with many features) to estimate property values. The famous "Zestimate" started as a linear regression.',
          '📈 Finance: Banks use it for credit scoring, portfolio risk assessment, and revenue forecasting. A 1% improvement in prediction accuracy can mean millions in saved losses.',
          '🏥 Healthcare: Predicting patient recovery time based on age, condition severity, and treatment type. Doctors use regression to determine optimal drug dosages — too little is ineffective, too much is dangerous.',
          '🌤️ Climate Science: Modeling temperature trends over decades. The "hockey stick" graph that showed global warming was built using regression techniques on historical temperature data.',
          '🏭 Manufacturing: Predicting machine failure time based on sensor readings. A factory can save millions by replacing parts just before they break.',
          '🚗 Insurance: Car insurance premiums are calculated using regression — your age, driving history, car type, and location all feed into the prediction.',
          'The beauty of Linear Regression is its INTERPRETABILITY. Unlike black-box models, you can explain exactly WHY a prediction was made: "The price increased by $150 for each additional square foot." Try explaining that with a 100-layer neural network!',
          'It is also the conceptual foundation of every neural network. The equation y = wx + b appears at every neuron. Understanding regression deeply means understanding the core of deep learning.',
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
          'Every straight line in 2D space can be completely described by just two numbers. That is remarkable — two numbers define an infinite line!',
          'y = mx + b',
          'Let us break this down piece by piece:',
          'm is the SLOPE — it answers "how much does y change when x increases by 1?" A slope of 3 means for every 1 unit increase in x, y increases by 3. A slope of -2 means y DECREASES by 2.',
          'b is the Y-INTERCEPT — the value of y when x = 0. It shifts the entire line up or down without changing its angle.',
          'In machine learning, we use slightly different notation: ŷ = wx + b. Here w (weight) is the slope and b (bias) is the intercept. The "hat" on ŷ means it is a PREDICTION, not the actual value.',
          'Why this notation? Because in neural networks, each connection has a "weight" and each neuron has a "bias." The ML notation connects directly to how neural networks work.',
          'Intuition: The weight w tells you HOW MUCH the input matters. A large |w| means x has a strong effect on the prediction. A small |w| means x barely matters. The sign of w tells you the DIRECTION: positive = "more input → more output," negative = "more input → less output."',
          'Use the sliders below to build intuition. Change the slope and intercept and observe how the line transforms!',
        ],
        interactiveType: 'slope-intercept',
      },
      {
        id: 'predictions',
        title: 'Making Predictions',
        description: 'How the model uses the equation',
        content: [
          'Once we have our line equation ŷ = wx + b with specific values for w and b, making predictions is pure arithmetic:',
          '1. Take a new input x (e.g., apartment size = 120 m²)',
          '2. Multiply by weight w: w × 120',
          '3. Add bias b: w × 120 + b = ŷ',
          '4. ŷ is your prediction (the estimated price)',
          'Example: If we learned w = 5000 and b = 100000, then for a 120 m² apartment: ŷ = 5000 × 120 + 100000 = 700,000 EGP.',
          'This means: each square meter adds ~5000 EGP to the price, and the base price is ~100,000 EGP.',
          'But here is the critical question: how do we find the BEST values for w and b? If we pick w = 3000 and b = 200000, we get a completely different line with different predictions.',
          'We need a systematic way to measure "how wrong are we?" and a method to improve. That is what the Cost Function (next module) and Gradient Descent (module after) solve.',
          'The key insight: prediction is EASY (just plug into the formula). LEARNING the right w and b is the hard part — and that is what makes machine learning interesting!',
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
          'Before we can improve our model, we need to answer: "How wrong is it?" The error for a single prediction is the gap between what we predicted and what actually happened.',
          'Error = Actual Value - Predicted Value = yᵢ - ŷᵢ',
          'For each data point, this error is the VERTICAL distance between the actual point and our regression line. Points above the line have positive error; points below have negative error.',
          'But we have MANY data points. Some errors are positive, some negative. If we just add them up, they might cancel out! A model could be terribly wrong on every point but have "zero total error" because the errors cancel.',
          'We need a way to combine all errors into a single number that tells us "overall, how bad is this model?" That single number is called the COST (or LOSS). Different ways of combining errors give us different cost functions.',
          'The cost function is the HEART of machine learning. Every training algorithm works by minimizing a cost function. Choose the wrong one, and your model optimizes for the wrong thing.',
          'Drag the line below and watch how the errors (red dashed lines) change. The total cost updates in real time!',
        ],
        interactiveType: 'cost-function',
      },
      {
        id: 'mse',
        title: 'Mean Squared Error',
        description: 'The standard measure of model performance',
        content: [
          'MSE = (1/n) × Σ(yᵢ - ŷᵢ)²',
          'This elegant formula is the most common cost function in regression. Let us understand why each part exists:',
          '1. (yᵢ - ŷᵢ): The raw error for each data point. Could be positive or negative.',
          '2. (...)²: We SQUARE each error. This does two critical things: (a) makes all errors positive so they cannot cancel out, and (b) penalizes large errors MORE than small ones. An error of 10 contributes 100, but an error of 2 contributes only 4.',
          '3. Σ: Sum across ALL n data points. We want total error, not individual errors.',
          '4. (1/n): Average by dividing by the number of points. This makes MSE independent of dataset size — a model with MSE = 5 on 100 points is comparable to MSE = 5 on 10000 points.',
          'Why squaring instead of absolute value? Two reasons: (1) The squared function is differentiable everywhere, which makes gradient descent work smoothly. The absolute value has a sharp corner at zero. (2) Squaring naturally penalizes outliers more — if a prediction is off by 10× more, the cost is 100× worse.',
          'Lower MSE = Better model. MSE = 0 means perfect predictions (almost never happens with real data due to noise).',
          'The gradient of MSE with respect to the weights gives us the direction to improve — this is what gradient descent uses!',
          'Drag the regression line away from the data points below and watch the MSE increase dramatically!',
        ],
        interactiveType: 'cost-function',
      },
      {
        id: 'residuals',
        title: 'Residual Analysis',
        description: 'Diagnosing your model through its errors',
        content: [
          'A residual is the difference between the actual value and the predicted value: residual = yᵢ - ŷᵢ. Residuals are your model\'s "report card" — they tell you WHERE and HOW the model fails.',
          'If your model is good, residuals should look like random noise: scattered randomly above and below zero with no pattern.',
          '🔍 Residual Plot: Plot residuals vs. predicted values. What patterns to look for:',
          '✅ Random scatter around zero: Your model is capturing the relationship well.',
          '🔄 Curved pattern: Your data has a nonlinear relationship that the line cannot capture. Consider polynomial features.',
          '📐 Funnel shape (spreading out): The variance of errors grows with prediction size. This is called heteroscedasticity — you might need to transform your target variable (log, sqrt).',
          '📊 Clusters: There might be subgroups in your data that behave differently. Consider grouping or adding indicator features.',
          'Residuals should also be normally distributed (bell curve). If they are skewed, your model has systematic bias in one direction.',
          'The visualization below shows your residuals in real time. A healthy model shows random scatter!',
        ],
        interactiveType: 'residuals',
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
          'Imagine you are standing on a mountain in dense fog — you cannot see more than a few feet ahead. Your goal: reach the lowest valley. What do you do?',
          'You feel the slope of the ground beneath your feet. If the ground slopes down to your left, you step left. If it slopes down to your right, you step right. You keep stepping downhill until you reach flat ground.',
          'That is EXACTLY what Gradient Descent does! But instead of a physical mountain, the "landscape" is the loss surface — a mathematical surface where the height at any point represents how bad the model is (the cost/loss).',
          'The x-axis represents the weight value (w), and the y-axis represents the loss at that weight. The shape is a U-curve (parabola) for MSE — there is exactly one minimum.',
          'The GRADIENT is the slope of this surface at your current position. It tells you two things: (1) which DIRECTION increases the loss, and (2) how STEEP the slope is. We move in the OPPOSITE direction (downhill).',
          'The update rule: w_new = w_old - α × gradient. We subtract because we want to go OPPOSITE to the gradient direction.',
          'The learning rate α controls how big each step is — we will explore this crucial parameter in the next lesson.',
          'Watch the ball roll down the 2D loss surface below. Notice how it slows down as it approaches the minimum (the gradient gets smaller)!',
        ],
        interactiveType: 'gradient-descent',
      },
      {
        id: 'gradient-3d',
        title: '3D Loss Landscape',
        description: 'Visualizing optimization in weight-bias space',
        content: [
          'In the previous lesson, we saw gradient descent on a 2D curve (1 weight). But real models have at least TWO parameters: weight w AND bias b. The loss surface becomes a 3D landscape!',
          'Imagine a bowl-shaped surface floating in 3D space. The x-axis is the weight w, the y-axis is the bias b, and the HEIGHT is the loss. The bottom of the bowl is the optimal (w*, b*) pair.',
          'For simple linear regression with MSE, this surface is always a smooth bowl (technically, an elliptic paraboloid). This is great news — there is exactly ONE minimum, and gradient descent will always find it!',
          'But the bowl might be stretched: if one parameter has a much larger effect on the loss than the other, the bowl becomes elongated (like an egg). This causes gradient descent to zig-zag inefficiently. Feature scaling fixes this by making the bowl more circular.',
          'The gradient in 3D is a VECTOR with two components: [∂L/∂w, ∂L/∂b]. It points in the direction of steepest ASCENT. We move in the opposite direction: steepest DESCENT.',
          'Each step updates BOTH parameters simultaneously: w -= α × ∂L/∂w and b -= α × ∂L/∂b.',
          'The contour plot below shows the loss landscape from above (like a topographic map). The ball navigates from a random starting point to the minimum. Watch the path it takes!',
        ],
        interactiveType: 'gradient-descent-3d',
      },
      {
        id: 'learning-rate',
        title: 'Learning Rate',
        description: 'The most important hyperparameter',
        content: [
          'The learning rate (α) is the single most impactful hyperparameter in machine learning. It controls the step size during optimization, and getting it right is crucial.',
          '⚡ Too HIGH (α = 1.0): The ball takes giant leaps, overshooting the minimum. It bounces back and forth, potentially getting FURTHER from the solution with each step. This is called DIVERGENCE — the loss explodes instead of decreasing.',
          '🐌 Too LOW (α = 0.0001): The ball takes tiny baby steps. It is heading in the right direction, but it will take thousands or millions of steps to reach the minimum. Training becomes impractically slow.',
          '✅ Just RIGHT (α ≈ 0.01–0.1): The ball makes steady progress, slowing naturally as it approaches the minimum (because the gradient shrinks). This is CONVERGENCE.',
          'How to choose? Common strategies: (1) Start with α = 0.01 and adjust. (2) Try values on a logarithmic scale: 0.001, 0.01, 0.1, 1.0. (3) Use learning rate schedules that DECREASE α over time — big steps early, small steps later.',
          'Modern optimizers like Adam automatically adapt the learning rate for each parameter. But understanding the fundamentals is essential for debugging when things go wrong!',
          'A key insight: the learning rate is a TRADEOFF. Fast convergence vs. stability. In practice, it is better to start slightly too small and increase than to start too large and diverge.',
          'Experiment with the learning rate slider below to see convergence, slow convergence, and divergence in action!',
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
          'Training is the process of ITERATIVELY improving the model. It follows a precise loop that repeats until the model is good enough:',
          '1️⃣ FORWARD PASS: Use current weights to make predictions for all training data. ŷ = wx + b for every data point.',
          '2️⃣ COMPUTE LOSS: Calculate the total error using the cost function (MSE). This single number tells us how bad the current model is.',
          '3️⃣ COMPUTE GRADIENTS: Calculate ∂Loss/∂w and ∂Loss/∂b — the partial derivatives that tell us which direction to adjust each parameter.',
          '4️⃣ UPDATE WEIGHTS: Apply the gradient descent update rule: w -= α × ∂L/∂w and b -= α × ∂L/∂b.',
          '5️⃣ REPEAT: Go back to step 1 with the updated weights.',
          'One complete pass through ALL training data is called an EPOCH. Typically, training runs for hundreds or thousands of epochs.',
          'CONVERGENCE: As training progresses, the loss decreases rapidly at first (big improvements are easy), then slows down (fine-tuning is harder). The loss curve looks like a hockey stick lying on its side.',
          'STOPPING CRITERIA: Stop when (1) loss stops decreasing, (2) validation loss starts increasing (overfitting), or (3) you reach a maximum number of epochs.',
          'Press the Train button below to watch the regression line slowly fit the data points in real time! The loss graph shows convergence.',
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
          'Linear Regression is powerful but it has CLEAR limitations. Understanding when it fails is as important as knowing when it works. A good data scientist knows the right tool for each problem.',
          '🔄 Nonlinear Data: If the true relationship is curved (quadratic, exponential, sinusoidal), a straight line cannot capture it. The best fit line will miss the pattern entirely. Solution: use polynomial features, or switch to a non-linear model.',
          '🎯 Outliers: A single extreme data point can dramatically shift the entire regression line. This is because MSE squares errors, so one point with error 100 dominates all points with error 5. Solution: use robust regression (MAE), or identify and handle outliers before training.',
          '📉 Underfitting: The model is too simple to capture the pattern. Signs: high training error AND high test error. Solution: add more features, use polynomial features, or try a more complex model.',
          '📈 Overfitting: Adding too many features (especially polynomial) makes the model memorize noise. Signs: very low training error but high test error. Solution: use regularization (L1/L2), reduce features, or get more data.',
          '🌊 Heavy Noise: When noise overwhelms the signal, even the "true" relationship is hard to recover. No model can predict random variation. Solution: collect more data (noise averages out), engineer better features, or accept the limitations.',
          '🔗 Multicollinearity: When features are highly correlated with EACH OTHER (size and rooms), the weights become unstable — small changes in data cause wild swings in coefficients. Solution: drop redundant features or use regularization.',
          'Toggle the scenarios below to see each failure mode in action!',
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
          'Linear Regression is one tool in a large toolbox. Choosing the right model for your data is a critical skill. Let us compare the main approaches:',
          '📏 Linear Regression: ŷ = wx + b. Pros: fast, interpretable, works well for linear trends, low risk of overfitting, requires little data. Cons: cannot capture curves or complex patterns. Use when: you suspect a roughly linear relationship, need explainability, or have limited data.',
          '🔄 Polynomial Regression: ŷ = w₁x + w₂x² + w₃x³ + ... + b. Pros: can model curves and more complex shapes. Cons: degree too high → overfitting (Runge phenomenon), less interpretable, requires more data. Use when: the data has clear curvature but you still want a single equation.',
          '🧠 Neural Networks: output = activation(W₂ × activation(W₁ × x + b₁) + b₂). Pros: can learn ANY pattern (Universal Approximation Theorem), scales to millions of features. Cons: requires lots of data, slow to train, black-box (hard to explain predictions), many hyperparameters to tune. Use when: you have lots of data and the relationship is highly non-linear.',
          'A critical principle: START SIMPLE. Try Linear Regression first. If it fails, try polynomial. Only use neural networks when simpler methods are clearly insufficient. This is called Occam\'s Razor — the simplest explanation that fits the data is usually the best.',
          'Compare them side-by-side below with the same dataset!',
        ],
        interactiveType: 'comparison',
      },
      {
        id: 'polynomial-regression',
        title: 'Polynomial Regression',
        description: 'Extending linear regression to curves',
        content: [
          'Here is a surprising fact: linear regression can fit CURVES. The "linear" in linear regression refers to being linear in the PARAMETERS (weights), not necessarily in the input x. This extension is called Polynomial Regression.',
          '🔑 The Core Trick — Feature Engineering: Instead of using just x, we CREATE new features from x: x², x³, x⁴, and so on. Then we run standard linear regression on these expanded features.',
          'Degree 1 (Linear): ŷ = w₁x + b — a straight line.',
          'Degree 2 (Quadratic): ŷ = w₁x + w₂x² + b — a parabola. Can model U-shapes like projectile trajectories or diminishing returns.',
          'Degree 3 (Cubic): ŷ = w₁x + w₂x² + w₃x³ + b — an S-curve. Can model growth with inflection points.',
          'Degree n: ŷ = w₁x + w₂x² + ... + wₙxⁿ + b — can model increasingly complex shapes.',
          '⚠️ The Overfitting Danger: Higher degree = more flexibility, but also more risk. A degree-20 polynomial can pass through every point perfectly (MSE = 0) but will make WILD predictions between and beyond the data. This is called overfitting — the model memorizes noise rather than learning the true pattern.',
          'The Bias-Variance Tradeoff in action: Degree too low → high bias (underfitting, misses the pattern). Degree too high → high variance (overfitting, fits noise). The sweet spot is the lowest degree that captures the true relationship.',
          'How it works mathematically: Given data points, we construct the Vandermonde matrix V where row i = [1, xᵢ, xᵢ², ..., xᵢⁿ]. Then we solve the normal equation: W = (VᵀV)⁻¹Vᵀy. This is EXACTLY linear regression — just with engineered features!',
          'In practice with scikit-learn: from sklearn.preprocessing import PolynomialFeatures; poly = PolynomialFeatures(degree=3); X_poly = poly.fit_transform(X); model.fit(X_poly, y). Three lines of code to go from linear to polynomial.',
          'Rule of thumb: Start with degree 1. If residuals show a clear pattern (curved), try degree 2. Rarely go above degree 3-4 unless you have LOTS of data. Always validate on held-out test data, not training data.',
          'Try it in the Playground! Switch to the Quadratic preset, then enable polynomial fitting and increase the degree. Watch how the curve adapts — and what happens when the degree gets too high.',
        ],
        interactiveType: 'comparison',
      },
    ],
  },
  {
    id: 'multivariate',
    title: 'Multivariable Regression',
    description: 'Extending to multiple features',
    icon: '🔢',
    color: '#8b5cf6',
    lessons: [
      {
        id: 'multiple-features',
        title: 'Multiple Features',
        description: 'From one variable to many',
        content: [
          'So far we used ONE feature (x) to predict y. But real-world problems rarely depend on a single variable. House price depends on size, bedrooms, age, location, condition, floor, and dozens more features.',
          'Multivariable Linear Regression extends the equation naturally:',
          'ŷ = w₁x₁ + w₂x₂ + w₃x₃ + ... + wₙxₙ + b',
          'Each feature xᵢ gets its OWN weight wᵢ. The model learns how much each feature independently contributes to the prediction.',
          'Interpretation is powerful: if w₁ (size) = 5000 and w₂ (bedrooms) = 20000, it means each extra m² adds 5000 EGP while each extra bedroom adds 20000 EGP, holding all other features constant.',
          'In vector notation: ŷ = W · X + b, where W is the weight vector [w₁, w₂, ..., wₙ] and X is the feature vector [x₁, x₂, ..., xₙ]. The dot product computes the weighted sum.',
          'This is EXACTLY what a single neuron computes in a neural network! The only difference: a neuron applies an activation function afterward: output = activation(W · X + b).',
          'Gradient descent works the same way, just with more parameters to update. Instead of computing one gradient ∂L/∂w, we compute a gradient VECTOR [∂L/∂w₁, ∂L/∂w₂, ..., ∂L/∂wₙ, ∂L/∂b].',
          'Adjust the weights below to see how each feature contributes to the house price prediction!',
        ],
        interactiveType: 'multivariate',
      },
      {
        id: 'matrix-formulation',
        title: 'Matrix Formulation',
        description: 'Linear algebra behind the scenes',
        content: [
          'With multiple features and many data points, individual equations become unwieldy. Matrix notation makes everything compact and elegant:',
          'X is an (m × n) matrix: m samples (rows), n features (columns). Each row is one data point, each column is one feature.',
          'W is an (n × 1) weight vector. b is a scalar bias.',
          'Predictions for ALL samples at once: Ŷ = XW + b',
          'This single matrix multiplication replaces m separate equations. GPUs can compute this in parallel, which is why deep learning uses matrices everywhere.',
          'The Normal Equation gives the OPTIMAL weights in one step (no iteration needed):',
          'W* = (XᵀX)⁻¹Xᵀy',
          'This is beautiful — one formula gives the best-possible weights. But there is a catch: computing (XᵀX)⁻¹ requires O(n³) time. With 1,000 features, that is 1 BILLION operations. With 100,000 features, it is impossible.',
          'That is why gradient descent exists: it is O(m × n) per step, which scales much better. For small problems (n < 1000), use the Normal Equation. For larger problems, use gradient descent.',
          'Scikit-learn automatically chooses the fastest method based on your data size.',
        ],
      },
      {
        id: 'feature-scaling',
        title: 'Feature Scaling',
        description: 'Why normalization matters',
        content: [
          'Consider two features: apartment size (50–500 m²) and number of bedrooms (1–6). The raw scales differ by 100×. Why does this matter?',
          'Without scaling, gradient descent struggles. The loss surface becomes a narrow, elongated ellipse instead of a circle. The gradient points mostly in the direction of the large-scale feature, causing zig-zag paths that converge very slowly.',
          'Two standard scaling methods:',
          '📏 Min-Max Normalization: x\' = (x - min) / (max - min). Scales all values to [0, 1]. Good when you know the range and there are no outliers.',
          '📊 Standardization (Z-score): x\' = (x - μ) / σ. Centers at mean=0, scales to std=1. More robust to outliers. The default choice in practice.',
          'After scaling, all features have comparable magnitudes. The loss surface becomes more circular, and gradient descent converges in a straight path to the minimum — often 10-100× faster!',
          'IMPORTANT: Fit the scaler on TRAINING data only, then transform both train and test data with the same parameters. If you fit on the full dataset, you are leaking test information into training (data leakage).',
          'Scaling does NOT change the model\'s predictions — the weights adjust to compensate. But it dramatically speeds up training and makes weight magnitudes comparable (useful for feature importance).',
          'Press Train below to see how scaling dramatically speeds up convergence!',
        ],
        interactiveType: 'feature-scaling',
      },
      {
        id: 'feature-selection',
        title: 'Feature Selection & Engineering',
        description: 'Choosing the right inputs',
        content: [
          'Having more features is NOT always better. The "curse of dimensionality" means that more features can actually HURT performance if many are irrelevant or redundant.',
          '🎯 Feature Selection: Keep only features that actually help prediction. Methods include:',
          '• Correlation analysis: Compute the correlation between each feature and the target. Drop features with near-zero correlation — they are noise.',
          '• Recursive Feature Elimination (RFE): Train the model, remove the least important feature, retrain, repeat. Keep only features that survive.',
          '• L1 Regularization (Lasso): Adds a penalty that automatically drives unimportant weights to exactly zero, effectively performing feature selection during training.',
          '🔗 Multicollinearity: When features correlate with EACH OTHER (e.g., house size and number of rooms are highly correlated), the model cannot separate their effects. Weights become unstable — small changes in data cause wild swings in coefficients.',
          'Detection: Calculate the Variance Inflation Factor (VIF). VIF > 10 means severe multicollinearity. Solution: drop one of the correlated features.',
          '🛠️ Feature Engineering: Create NEW features from existing ones to capture hidden patterns:',
          '• Interaction terms: size × bedrooms captures the effect of large bedrooms specifically.',
          '• Polynomial features: x² captures curvature while still using linear regression!',
          '• Domain-specific: price_per_sqm = price / size, or age_of_building = current_year - year_built.',
          'Good feature engineering is often more impactful than choosing a fancy algorithm. A linear model with great features beats a neural network with raw features.',
        ],
      },
    ],
  },
  {
    id: 'data-intuition',
    title: 'Data Intuition',
    description: 'Learn to see patterns before math',
    icon: '👁️',
    color: '#14b8a6',
    lessons: [
      {
        id: 'seeing-data',
        title: 'Seeing Patterns in Data',
        description: 'Train your eyes before training a model',
        content: [
          'The best data scientists do NOT start by running algorithms. They start by LOOKING at their data. Visualization is your first and most powerful tool.',
          'A scatter plot is your primary weapon. Plot feature (x) vs. target (y) and look for patterns with your eyes before trusting any algorithm.',
          '📈 Strong positive correlation (r ≈ +0.9): Points form a tight upward band. As x increases, y increases predictably. Example: study hours vs. exam score.',
          '📉 Strong negative correlation (r ≈ -0.9): Points form a tight downward band. As x increases, y decreases. Example: car age vs. resale value.',
          '🎯 No correlation (r ≈ 0): Points form a random cloud. x and y are unrelated. Example: shoe size vs. exam score.',
          '⚠️ Non-linear pattern (r ≈ 0 but clear pattern): Points form a curve — Pearson r misses this! Always plot before computing. Example: drug dosage vs. effectiveness (inverted U-shape).',
          'The Pearson correlation coefficient r ranges from -1 (perfect negative) to +1 (perfect positive). But remember: r only captures LINEAR relationships!',
          'Draw points below and see if you can create strong, weak, and no correlations! The app calculates r in real time.',
        ],
        interactiveType: 'correlation',
      },
      {
        id: 'correlation-causation',
        title: 'Correlation ≠ Causation',
        description: 'The most dangerous mistake in data science',
        content: [
          'This is arguably the most important lesson in all of data science. Getting this wrong has led to disastrous policy decisions, wasted billions, and bad science.',
          '🍦 Ice cream sales and drowning deaths correlate at r ≈ 0.85 every summer. Does ice cream cause drowning? NO! Both are caused by a CONFOUNDING VARIABLE: hot weather makes people buy ice cream AND go swimming.',
          '👟 Children with bigger feet read better. Do shoes make you smarter? NO! Age is the hidden variable — older kids have bigger feet AND better reading skills.',
          '📺 Countries that consume more chocolate win more Nobel Prizes (r ≈ 0.79). Does chocolate make geniuses? NO! Wealthy countries afford both chocolate and research funding.',
          '🦈 Shark attacks and ice cream sales both peak in summer. Should we ban ice cream to prevent shark attacks?',
          'Three types of causal relationships:',
          '• Direct causation: Smoking → Lung cancer (proven through controlled experiments)',
          '• Reverse causation: Does crime cause poverty, or does poverty cause crime? The arrow might go either way!',
          '• Confounding: A hidden third variable causes BOTH. This is the most common trap.',
          'Machine learning models find CORRELATIONS — they cannot determine causation. Only randomized controlled experiments (A/B tests) can establish causation.',
          'This is why domain knowledge matters as much as algorithms. A model might discover that "ice cream sales predict drowning" — only a human with context knows this is spurious!',
        ],
      },
    ],
  },
  {
    id: 'bias-variance',
    title: 'Bias-Variance Tradeoff',
    description: 'The art of generalization',
    icon: '⚖️',
    color: '#f97316',
    lessons: [
      {
        id: 'underfitting-overfitting',
        title: 'Underfitting vs Overfitting',
        description: 'Finding the sweet spot',
        content: [
          'The bias-variance tradeoff is the CENTRAL dilemma in machine learning. Every model sits somewhere on a spectrum between two extremes:',
          '📖 Underfitting (High Bias, Low Variance): The model is too SIMPLE. Like a student who barely studied — they know the general topic but miss all nuances. A straight line fit to curved data. Predictions are consistently wrong in the same way.',
          '🤓 Overfitting (Low Bias, High Variance): The model is too COMPLEX. Like a student who memorized the textbook word-for-word — they ace practice tests but fail on new questions. A degree-15 polynomial that wiggles through every training point but predicts terribly on new data.',
          '✅ Good Fit (Balanced): The model captures the TRUE underlying pattern without memorizing noise. Like a student who understood the CONCEPTS and can answer questions they have never seen.',
          'BIAS: How far off the model\'s average predictions are from the truth. A model with high bias "misses the target center" consistently.',
          'VARIANCE: How much the model\'s predictions change when trained on different data. A model with high variance gives wildly different predictions depending on which training data it saw.',
          'The tradeoff: increasing model complexity reduces bias (fits the data better) but increases variance (becomes more sensitive to specific training data). The sweet spot minimizes TOTAL error = bias² + variance.',
          'Experiment below: slide the polynomial degree and watch the model go from underfitting → good fit → overfitting. Pay attention to train MSE vs test MSE!',
        ],
        interactiveType: 'bias-variance',
      },
      {
        id: 'train-test-split',
        title: 'Train/Test Split',
        description: 'How to honestly evaluate your model',
        content: [
          'If you test your model on the SAME data it trained on, it is like grading a student on exactly the questions they practiced. Of course they will score well — but can they handle new questions?',
          'The solution: BEFORE training, split your data into separate sets:',
          '🏋️ Training set (typically 70-80%): The model learns from this data. Only this data is used during gradient descent.',
          '🧪 Test set (typically 20-30%): The model is evaluated on this data which it has NEVER seen during training. This simulates real-world performance.',
          '📊 Validation set (optional, ~10-15%): Used to tune hyperparameters (learning rate, polynomial degree) without touching the test set.',
          'How to diagnose:',
          '• High train error + High test error → UNDERFITTING. Model is too simple.',
          '• Low train error + High test error → OVERFITTING. Model memorized training data.',
          '• Low train error + Low test error → GREAT! The model generalizes well. 🎉',
          '• High train error + Low test error → Very rare. Usually means a bug or data leakage.',
          'GOLDEN RULE: Never, EVER peek at your test set during training or hyperparameter tuning. That is DATA LEAKAGE — the cardinal sin of machine learning. It gives you falsely optimistic results that will not hold in production.',
          'K-Fold Cross Validation: For small datasets, split into K parts. Train on K-1 parts, test on the remaining one. Repeat K times and average the results. This gives a more reliable estimate than a single split.',
        ],
      },
    ],
  },
  {
    id: 'evaluation',
    title: 'Evaluation Metrics',
    description: 'Measuring model quality beyond MSE',
    icon: '📊',
    color: '#06b6d4',
    lessons: [
      {
        id: 'metrics-zoo',
        title: 'The Metrics Zoo',
        description: 'MAE, RMSE, R² and when to use each',
        content: [
          'MSE is not the only way to measure model quality. Different metrics answer different questions, and choosing the right metric matters enormously for model selection.',
          '📏 MAE (Mean Absolute Error) = (1/n) × Σ|yᵢ - ŷᵢ|. The average of absolute errors. Intuitive: "on average, predictions are off by X units." Not sensitive to outliers because errors are NOT squared. Use when all errors are equally bad.',
          '📐 RMSE (Root Mean Squared Error) = √MSE. Same units as the target (unlike MSE which is in squared units). Penalizes large errors more than MAE. Use when big errors are disproportionately bad (e.g., predicting bridge load capacity — being off by a lot is catastrophic).',
          '📊 R² (Coefficient of Determination) = 1 - (SS_res / SS_total). Answers: "What fraction of the variance in y does our model explain?" Ranges from -∞ to 1.',
          'R² = 1.0 → Perfect predictions. R² = 0.0 → Model is no better than always predicting the mean. R² < 0 → Model is WORSE than the mean (this can happen with a very bad model)!',
          'Comparing metrics: If you have predictions [10, 12, 15] vs actuals [11, 10, 14]: MAE = (1+2+1)/3 = 1.33, MSE = (1+4+1)/3 = 2.0, RMSE = √2.0 = 1.41. Notice MSE is highest because of the squared error of 2.',
          'MAPE (Mean Absolute Percentage Error): (1/n) × Σ(|yᵢ - ŷᵢ|/|yᵢ|) × 100%. Useful for comparing across different scales: "predictions are off by 5% on average." But breaks when actual values are near zero!',
          'Choosing your metric depends on the BUSINESS problem. For predicting delivery time: use MAE (customers care equally about 5-min and 30-min delays). For structural engineering: use RMSE (large errors are dangerous). For comparing models across datasets: use R².',
          'Adjust the regression line below and see how all metrics respond differently!',
        ],
        interactiveType: 'metrics',
      },
    ],
  },
  {
    id: 'lr-to-nn',
    title: 'Into Neural Networks',
    description: 'How regression evolves into deep learning',
    icon: '🧠',
    color: '#ec4899',
    lessons: [
      {
        id: 'single-neuron',
        title: 'A Neuron IS Linear Regression',
        description: 'The surprising connection',
        content: [
          'Here is the secret that connects everything you have learned to deep learning — and it is beautifully simple:',
          'A single artificial neuron computes: output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)',
          'Look at the inside of the activation: w₁x₁ + w₂x₂ + ... + wₙxₙ + b. That is EXACTLY multivariable linear regression! ŷ = W·X + b',
          'Remove the activation function → a single neuron IS linear regression. The concepts are identical:',
          '• Weights (w) = the slope/coefficients you learned in Module 2',
          '• Bias (b) = the intercept you learned in Module 2',
          '• Forward pass = making predictions (Module 5)',
          '• Loss function = MSE or cross-entropy (Module 3)',
          '• Gradient descent = the same algorithm (Module 4)',
          '• Backpropagation = chain rule to compute gradients through layers',
          'Training a neural network uses the SAME gradient descent you already mastered — just with more parameters and the chain rule to propagate gradients backward through layers.',
          'You already understand the CORE of deep learning. A neural network is a collection of linear regressions stacked together with non-linear activations in between. Every neuron is running y = wx + b under the hood!',
          'Watch below as we build from 1 neuron → hidden layers → a network!',
        ],
        interactiveType: 'neuron-bridge',
      },
      {
        id: 'beyond-linear',
        title: 'Why We Need Layers',
        description: 'Breaking the linearity barrier',
        content: [
          'Linear regression can only model straight lines (or flat hyperplanes in higher dimensions). But the real world is full of curves, thresholds, and complex interactions.',
          'A critical mathematical fact: stacking linear transformations does NOT help. If f(x) = ax + b and g(x) = cx + d, then g(f(x)) = c(ax + b) + d = (ca)x + (cb + d) — still a linear function! No matter how many linear layers you stack, you get... another linear function.',
          'The ACTIVATION FUNCTION is what breaks this limitation. Common choices:',
          '• ReLU(x) = max(0, x): Simple, fast, the default in modern networks. Introduces a "bend" at zero.',
          '• Sigmoid(x) = 1/(1+e⁻ˣ): Squishes output to (0,1). Used for binary probabilities.',
          '• Tanh(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ): Like sigmoid but centered at 0. Output range (-1,1).',
          'With just ONE hidden layer + non-linear activation, a neural network can approximate ANY continuous function to arbitrary precision (Universal Approximation Theorem, 1989).',
          'Deeper networks can learn HIERARCHICAL representations. In image recognition: Layer 1 learns edges, Layer 2 learns shapes, Layer 3 learns parts (eyes, wheels), Layer 4 learns objects (faces, cars).',
          'Your journey through this course: y = wx + b → ŷ = W·X + b → activation(W·X + b) → Deep Learning 🚀',
          'Everything you learned — cost functions, gradient descent, the training loop, bias-variance, evaluation — applies DIRECTLY to neural networks. You have built the foundation!',
        ],
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

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string[];
  interactiveType?: 'regression-canvas' | 'slope-intercept' | 'cost-function' | 'gradient-descent' | 'gradient-descent-3d' | 'training' | 'failure-cases' | 'comparison' | 'multivariate' | 'feature-scaling' | 'correlation' | 'bias-variance' | 'metrics' | 'neuron-bridge' | 'loss-landscape' | 'residuals';
  image?: string;
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
    id: 'history',
    title: 'The Story of the Line',
    description: 'A 200-year journey from astronomy to AI',
    icon: '📜',
    color: '#d97706',
    lessons: [
      {
        id: 'origins',
        title: 'Where It All Began',
        description: 'Legendre, Gauss, and the quest to predict the heavens',
        content: [
          'Our story begins on the first night of the 19th century — January 1, 1801. An Italian astronomer named Giuseppe Piazzi pointed his telescope at the sky and discovered something extraordinary: a new celestial body, later named Ceres, the first known asteroid.',
          'Piazzi tracked Ceres for 41 nights before it disappeared behind the Sun. The scientific world was electrified — but there was a crisis. With only 41 observations spanning a tiny arc of the sky, could anyone predict WHERE Ceres would reappear months later on the other side of the Sun?',
          'Enter Carl Friedrich Gauss, a 24-year-old German mathematician often called the "Prince of Mathematics." Using a method he had quietly developed — the method of least squares — Gauss made a prediction. He fit a curve through Piazzi\'s sparse data points by minimizing the sum of squared errors between his model and the observations.',
          'On December 7, 1801, astronomer Franz Xaver von Zach pointed his telescope exactly where Gauss predicted. There it was — Ceres, right where the math said it would be. The world was stunned. Gauss became famous overnight, and the method of least squares became the most important tool in science.',
          'But here is the twist: Gauss claimed he had developed least squares as early as 1795, when he was just 18 years old! The French mathematician Adrien-Marie Legendre had published the method first in 1805, in his book "Nouvelles méthodes pour la détermination des orbites des comètes." A priority dispute erupted that lasted decades.',
          'Regardless of who came first, the core idea was revolutionary: given noisy, imperfect data, find the line (or curve) that BEST fits the observations by minimizing the squared distances. This is EXACTLY what Linear Regression does — and you are about to learn the same method that found a lost asteroid.',
        ],
        image: '/illustrations/origins.svg',
      },
      {
        id: 'evolution',
        title: 'From Stars to Statistics',
        description: 'How regression got its name and changed the world',
        content: [
          'The word "regression" has a surprising origin. In the 1880s, Sir Francis Galton — a Victorian polymath, cousin of Charles Darwin, and pioneer of statistics — was studying something very human: the heights of parents and their children.',
          'Galton collected height data from hundreds of families and made a striking observation: very tall parents tended to have children who were tall, but NOT as tall as their parents. Very short parents had children who were short, but NOT as short as their parents. Heights "regressed" toward the average of the population.',
          'He called this phenomenon "regression toward mediocrity" (later softened to "regression to the mean"). The mathematical line he drew through the parent-child height data became a "regression line." The name stuck — and that is why we call it "regression" to this day, even when we are predicting house prices or stock returns.',
          'Galton\'s student, Karl Pearson, formalized this work and created the correlation coefficient (r) that we still use. Pearson also extended regression to multiple variables, laying the groundwork for the multivariable regression you will learn in Module 9.',
          'By the early 1900s, regression had spread from astronomy and biology into economics, psychology, agriculture, and engineering. Ronald Fisher used it to design experiments that doubled crop yields. Economists used it to model supply and demand. It became the Swiss Army knife of quantitative analysis.',
          'The mid-20th century brought computers, and regression exploded. Calculations that took Gauss weeks by hand could now be done in milliseconds. By the 1960s, regression was the standard tool in every scientific field — from medicine to marketing.',
          'Then came the AI revolution. In 2012, a neural network called AlexNet stunned the world by crushing image recognition benchmarks. But look inside any neural network, and what do you find? At every single neuron: y = w₁x₁ + w₂x₂ + ... + b — the same linear equation Gauss and Legendre used to find Ceres. The method that started with stargazing became the DNA of artificial intelligence.',
        ],
        image: '/illustrations/evolution.svg',
      },
      {
        id: 'timeline',
        title: 'The Timeline',
        description: 'Key milestones in the regression story',
        content: [
          'Let us trace the full arc of this remarkable journey — from handwritten calculations by candlelight to GPU-powered deep learning:',
          '📅 1795 — Young Carl Friedrich Gauss (age 18) develops the method of least squares for his private calculations. He does not publish it, a decision he would later regret.',
          '📅 1801 — Giuseppe Piazzi discovers Ceres. Gauss uses least squares to predict its orbit from just 41 observations. The prediction is spectacularly accurate, and Gauss becomes famous.',
          '📅 1805 — Adrien-Marie Legendre publishes the method of least squares in his book on comet orbits. This is the first PUBLISHED description. The priority dispute with Gauss begins.',
          '📅 1809 — Gauss publishes his method in "Theoria Motus," connecting least squares to the normal (Gaussian) distribution. He proves that if errors are normally distributed, least squares gives the most probable estimate.',
          '📅 1822 — Gauss extends least squares to the case of multiple unknowns, creating what we now call multivariable regression. He derives the normal equation: W* = (XᵀX)⁻¹Xᵀy.',
          '📅 1885 — Sir Francis Galton coins the term "regression" while studying hereditary height. He discovers regression to the mean and draws the first regression line through human data.',
          '📅 1896 — Karl Pearson formalizes the correlation coefficient (r) and develops the mathematics of multiple regression. Statistics becomes a formal discipline.',
          '📅 1922 — Ronald Fisher introduces maximum likelihood estimation and analysis of variance (ANOVA), connecting regression to experimental design. He proves the optimality properties of least squares.',
          '📅 1943 — Warren McCulloch and Walter Pitts propose the first mathematical model of a neuron: a weighted sum of inputs (linear regression!) followed by a threshold activation. The seed of neural networks is planted.',
          '📅 1957 — Frank Rosenblatt builds the Perceptron, the first trainable neural network. Its core computation: y = activation(w₁x₁ + w₂x₂ + b). Sound familiar? It is linear regression with an activation function.',
          '📅 1960s — Computers make regression practical for large datasets. Every scientific field adopts it. Statistical software packages (SPSS, SAS) democratize access.',
          '📅 1970 — Lasso (L1) and Ridge (L2) regularization are developed, solving the overfitting problem that plagued early regression models with many features.',
          '📅 1986 — Geoffrey Hinton popularizes backpropagation for training multi-layer neural networks. The algorithm? Gradient descent on a loss function — the same gradient descent used in linear regression, extended with the chain rule.',
          '📅 2012 — AlexNet wins ImageNet by a huge margin, igniting the deep learning revolution. Inside every layer: linear transformation → activation → linear transformation → activation. The ghost of y = wx + b lives in every neuron.',
          '📅 2017 — The Transformer architecture ("Attention Is All You Need") revolutionizes NLP. Self-attention is a learned linear combination of inputs — regression at its core, made adaptive.',
          '📅 2022-2026 — Large Language Models (GPT-4, Gemini, Claude) demonstrate stunning capabilities. Billions of parameters, but each one participates in a linear computation y = Wx + b inside every layer. The 18-year-old Gauss would recognize the math, if not the scale.',
          'From a candlelit study in 1795 to trillion-parameter models in 2026 — the line that Gauss drew through the stars now powers the AI that writes code, creates art, and converses with you. And it all started with the simple question: what is the BEST line through these points?',
        ],
        image: '/illustrations/timeline.svg',
      },
    ],
  },
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
          'You have just learned the incredible history behind regression — from Gauss predicting asteroids to Galton measuring heights. Now let us build the intuition for what Linear Regression actually IS, step by step.',
          'Imagine you are a detective. You have a collection of clues (data points), and you need to find the hidden pattern (the line) that connects them. Linear Regression is your magnifying glass.',
          'Here is a concrete scenario. You collect data about apartments in your city — their sizes and prices. You plot each apartment as a dot: x-axis is size, y-axis is price. As you plot more dots, a pattern emerges: bigger apartments cost more. The dots form a rough upward band.',
          'Now imagine stretching a rubber band through this cloud of dots. The rubber band naturally settles into the position that gets as close as possible to ALL the dots. That settled position IS the regression line.',
          'Mathematically, the line is described by just two numbers: ŷ = wx + b. The weight w is the slope (how much price changes per square meter), and the bias b is the starting price (what a 0 m² apartment would theoretically cost). The hat on ŷ means "prediction" — it is our best guess, not necessarily the truth.',
          'Why "best"? Because infinitely many lines could pass through a cloud of points. Linear Regression finds the ONE line that minimizes the total prediction error across all points. It is the line that is the LEAST wrong overall.',
          'Here is a secret that will reshape how you think about AI: every single neuron in every neural network — from GPT to self-driving cars — starts with this exact computation: y = wx + b. Linear Regression is not a beginner\'s algorithm. It is the atomic unit of intelligence in every AI system ever built.',
          'Click on the canvas below to add data points and watch the regression line update in real time. Try adding points in a line, then add some noise, then add an outlier. Feel the math!',
        ],
        interactiveType: 'regression-canvas',
      },
      {
        id: 'why-lr',
        title: 'Why Do We Need It?',
        description: 'Real-world applications and importance',
        content: [
          'In 1854, a London doctor named John Snow plotted cholera deaths on a map and drew lines connecting the cases to water pumps. His regression-like analysis traced the epidemic to a single contaminated pump on Broad Street. He removed the pump handle, and the epidemic stopped. Data and lines saved thousands of lives.',
          'That spirit — using data to draw lines that predict, explain, and save — is exactly what Linear Regression does today, at global scale:',
          '🏠 Real Estate: Zillow\'s "Zestimate" started as a regression model. It estimates the value of 100+ million homes in the US using features like size, location, age, and recent comparable sales. Every home page you view on Zillow runs a regression prediction in milliseconds.',
          '📈 Finance: JPMorgan Chase uses regression models for credit scoring — predicting the probability you will default on a loan based on your income, employment history, existing debt, and hundreds of other factors. A 1% improvement in prediction accuracy saves the bank millions in avoided bad loans.',
          '🏥 Healthcare: Doctors at Johns Hopkins use regression to predict patient recovery time after surgery based on age, BMI, procedure type, and pre-existing conditions. This helps schedule operating rooms, plan staffing, and set patient expectations. In oncology, regression models predict tumor growth rates to optimize treatment timing.',
          '🌤️ Climate Science: The "hockey stick" graph that became central to the climate change debate was built using regression techniques on temperature proxy data (ice cores, tree rings) spanning 1,000 years. The regression line showed temperatures were stable for centuries, then shot upward in the industrial era.',
          '🏭 Manufacturing: Toyota uses regression models in predictive maintenance — predicting when a machine will fail based on vibration data, temperature readings, and usage hours. Replacing a part just before failure (instead of after) saves millions in downtime and prevents defective products.',
          '🚗 Insurance: Your car insurance premium is literally a regression prediction. Actuaries feed your age, driving record, car model, ZIP code, and credit score into a model that predicts your expected annual claim cost. That prediction becomes your premium.',
          '🛒 E-commerce: Amazon\'s demand forecasting uses regression at massive scale — predicting how many units of each product to stock in each warehouse, based on historical sales, seasonality, promotions, and competitor pricing. Getting this right by even 1% saves billions in inventory costs.',
          'The beauty of Linear Regression is its INTERPRETABILITY. Unlike a neural network that says "the price is $500,000" with no explanation, regression tells you exactly WHY: "Each square meter adds $2,000, each bedroom adds $15,000, and the neighborhood baseline is $300,000." Doctors, judges, and regulators demand this kind of explainability.',
          'You are not learning a toy algorithm. You are learning the tool that prices your insurance, approves your loans, predicts the weather, and underlies every neuron in every AI system. Let us master it.',
        ],
        image: '/illustrations/why-lr.svg',
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
          'In 1637, René Descartes published "La Géométrie," introducing the idea of describing geometric shapes with algebraic equations. For the first time, a straight line could be captured in a formula. That formula has not changed in nearly 400 years:',
          'y = mx + b',
          'Two numbers. That is all it takes to completely describe an infinite straight line. Let us feel what each number does:',
          'm is the SLOPE — it answers "how much does y change when x increases by 1?" Think of it as the steepness of a hill. A slope of 3 means for every step forward, you climb 3 steps up. A slope of -2 means you descend 2 steps. A slope of 0 means flat ground — x changes but y stays the same.',
          'b is the Y-INTERCEPT — the value of y when x = 0. It is where the line crosses the vertical axis. Think of it as the "starting point" — the value you get before any input contributes.',
          'In machine learning, we use slightly different notation: ŷ = wx + b. Here w (weight) is the slope and b (bias) is the intercept. The "hat" on ŷ means it is a PREDICTION, not the actual value. This notation connects directly to neural networks, where every connection has a "weight" and every neuron has a "bias."',
          'The weight w tells you HOW MUCH the input matters. A large |w| means x has a strong effect on the prediction — a sensitive lever. A small |w| means x barely matters — it is noise. The sign of w tells you the DIRECTION: positive means "more input → more output" (e.g., more study hours → higher grades), negative means "more input → less output" (e.g., more car age → lower resale value).',
          'Here is an insight that will serve you throughout this course: in a neural network with millions of parameters, EVERY parameter is either a weight (slope) or a bias (intercept). When you hear "GPT-4 has 1.8 trillion parameters," think: 1.8 trillion slopes and intercepts, organized in clever architectures. The math is the same — just scaled up.',
          'Use the sliders below to build intuition. Change the slope and intercept and observe how the line transforms! Try to predict what happens before you move each slider.',
        ],
        interactiveType: 'slope-intercept',
      },
      {
        id: 'predictions',
        title: 'Making Predictions',
        description: 'How the model uses the equation',
        content: [
          'You know the equation. Now let us use it. Making a prediction with Linear Regression is beautifully mechanical — plug in, compute, done.',
          'Here is the recipe: ŷ = wx + b',
          '1. Take a new input x that you want a prediction for (e.g., apartment size = 120 m²)',
          '2. Multiply by the learned weight: w × 120',
          '3. Add the learned bias: w × 120 + b = ŷ',
          '4. ŷ is your prediction (the estimated price)',
          'Concrete example: suppose from our training data, we learned w = 5,000 and b = 100,000. For a 120 m² apartment: ŷ = 5,000 × 120 + 100,000 = 700,000 EGP. The model says: each square meter adds about 5,000 EGP, and the baseline price is 100,000 EGP.',
          'This is called INFERENCE — using a trained model to make predictions on new data. In production systems, inference must be FAST. The beauty of linear regression is that prediction is just one multiplication and one addition — O(1)! Even a cheap microcontroller can make predictions in microseconds.',
          'But wait — how did we get w = 5,000 and b = 100,000? Who chose these numbers? If we pick w = 3,000 and b = 200,000 instead, we get a completely different line: 3,000 × 120 + 200,000 = 560,000 EGP. A dramatically different prediction!',
          'We need a systematic way to measure "how wrong are we?" and a method to find the BEST w and b. That is what the Cost Function (next module) and Gradient Descent (the module after) solve. Prediction is EASY — learning is where the magic happens.',
          'Fun fact: when you ask ChatGPT a question, the "prediction" step is conceptually identical. It multiplies your input by billions of weights, adds biases, and computes a prediction — just at an incomprehensibly larger scale. But the DNA is the same y = wx + b you just learned.',
        ],
        image: '/illustrations/predictions.svg',
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
          'In 1846, the astronomer Urbain Le Verrier noticed that the orbit of Uranus did not match predictions. The errors between observed and predicted positions were small but systematic — they formed a pattern. Le Verrier used these errors to predict the existence and location of an UNDISCOVERED planet. Telescopes pointed where the errors suggested, and there it was — Neptune. Errors, properly analyzed, led to one of the greatest discoveries in astronomy.',
          'In machine learning, errors are not embarrassments — they are INFORMATION. The error for a single prediction is the gap between what we predicted and what actually happened:',
          'Error = Actual Value − Predicted Value = yᵢ − ŷᵢ',
          'For each data point, this error is the VERTICAL distance between the actual point and our regression line. Points above the line have positive error (we underestimated). Points below have negative error (we overestimated).',
          'But we have MANY data points, and some errors are positive while others are negative. If we simply add them up, they might cancel out! A model could be horribly wrong on every single point but have "zero total error" because the positives and negatives cancel. That would be deceptive — a model that is wrong everywhere looks perfect.',
          'We need a way to combine all errors into a SINGLE number that honestly tells us "overall, how bad is this model?" That number is called the COST (or LOSS). Different ways of combining errors give us different cost functions, each with its own personality.',
          'The cost function is the HEART of machine learning. It defines what "good" means for your model. Every training algorithm works by minimizing a cost function. Choose the wrong one, and your model optimizes for the wrong thing — like studying for the wrong exam.',
          'Drag the line below and watch how the errors (red dashed lines) change. The total cost updates in real time! Try to minimize it by hand — you are doing what gradient descent does automatically.',
        ],
        interactiveType: 'cost-function',
      },
      {
        id: 'mse',
        title: 'Mean Squared Error',
        description: 'The standard measure of model performance',
        content: [
          'In 1809, Gauss proved something remarkable: if measurement errors follow a bell-shaped (normal) distribution — which they almost always do in nature — then the best possible estimate is the one that minimizes the sum of SQUARED errors. This principle became the foundation of modern statistics.',
          'MSE = (1/n) × Σ(yᵢ − ŷᵢ)²',
          'This elegant formula is the most common cost function in regression. Let us understand why each part exists and why it has endured for over 200 years:',
          '1. (yᵢ − ŷᵢ): The raw error for each data point. Could be positive (underestimate) or negative (overestimate).',
          '2. (...)²: We SQUARE each error. This does two critical things: (a) makes all errors positive so they cannot cancel out — every error "counts" regardless of direction, and (b) penalizes large errors MORE than small ones. An error of 10 contributes 100 to the cost, but an error of 2 contributes only 4. Being wrong by a lot is disproportionately expensive.',
          '3. Σ: Sum across ALL n data points. We want total error, not individual errors. The model must be good EVERYWHERE, not just on a few points.',
          '4. (1/n): Average by dividing by the number of points. This makes MSE independent of dataset size — a model with MSE = 5 on 100 points is comparable to MSE = 5 on 10,000 points.',
          'Why squaring instead of absolute value? Two reasons that changed the course of mathematics: (1) The squared function is smooth and differentiable everywhere, which makes gradient descent work like a ball rolling smoothly downhill. The absolute value has a sharp corner at zero where the gradient is undefined — the ball would "snag." (2) Squaring naturally penalizes outliers more, which is usually what we want.',
          'Lower MSE = Better model. MSE = 0 means perfect predictions on training data (almost never happens with real data due to irreducible noise — the randomness inherent in the world).',
          'Historical note: Gauss showed that minimizing MSE is equivalent to finding the most LIKELY parameters under Gaussian noise — a result called Maximum Likelihood Estimation. This deep connection between geometry (least squares) and probability (maximum likelihood) is one of the most beautiful results in mathematics.',
          'Drag the regression line below and watch the MSE change. Notice how a single outlier can dominate the entire cost!',
        ],
        interactiveType: 'cost-function',
      },
      {
        id: 'residuals',
        title: 'Residual Analysis',
        description: 'Diagnosing your model through its errors',
        content: [
          'Remember Le Verrier discovering Neptune by analyzing residual errors? That is exactly what residual analysis is — studying your model\'s mistakes to find hidden truths.',
          'A residual is the difference between the actual value and the predicted value: residual = yᵢ − ŷᵢ. Residuals are your model\'s "report card" — they tell you WHERE and HOW the model fails, and whether those failures reveal a deeper pattern.',
          'If your model is good, residuals should look like random noise: scattered randomly above and below zero with no discernible pattern. This means the model has captured ALL the systematic information, and only irreducible randomness remains.',
          '🔍 Residual Plot: Plot residuals vs. predicted values. This is the most powerful diagnostic tool in regression:',
          '✅ Random scatter around zero: Your model is capturing the relationship well. The remaining errors are just noise. Celebrate!',
          '🔄 Curved pattern: Your data has a nonlinear relationship that the straight line cannot capture. The residuals are literally SHOWING you the missing curve. Solution: add polynomial features (x², x³) to capture it.',
          '📐 Funnel shape (spreading out): The variance of errors grows with prediction size — small predictions have small errors, large predictions have large errors. This is called heteroscedasticity (from Greek: "different scatter"). Solution: transform your target variable with log or square root to stabilize the variance.',
          '📊 Clusters: There might be subgroups in your data that behave differently — perhaps two different markets or two different populations mixed together. Solution: segment your data or add indicator features.',
          'Residuals should also be approximately normally distributed (bell curve). If they are skewed, your model has systematic bias — it consistently overestimates or underestimates in certain regions.',
          'The father of modern residual analysis was F.J. Anscombe, who in 1973 created "Anscombe\'s Quartet" — four datasets with identical summary statistics (mean, variance, correlation, regression line) but wildly different patterns. Only by plotting residuals could you tell them apart. His message: ALWAYS visualize, never trust summary statistics alone.',
          'The visualization below shows your residuals in real time. Look for patterns — they are messages from your data!',
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
          'It is 1847, and the French mathematician Augustin-Louis Cauchy has a problem. He needs to find the minimum of a complex function with many variables — too many for algebraic solutions. He proposes an elegant idea: start somewhere, compute the slope, take a small step downhill, repeat. He calls it "the method of steepest descent." It is the first description of what we now call Gradient Descent.',
          'Imagine you are standing on a mountain in dense fog — you cannot see more than a few feet in any direction. Your goal: reach the lowest valley. What do you do?',
          'You feel the slope of the ground beneath your feet. If the ground slopes down to your left, you step left. If it slopes down to your right, you step right. You keep stepping downhill, always following the steepest descent, until you reach flat ground where no direction leads further down.',
          'That is EXACTLY what Gradient Descent does! But instead of a physical mountain, the "landscape" is the loss surface — a mathematical surface where the height at any point represents how bad the model is (the loss/cost).',
          'For linear regression with one weight: the x-axis represents the weight value (w), and the y-axis represents the MSE at that weight. Gauss proved this surface is a parabola (U-shaped curve) — there is exactly ONE minimum, and gradient descent will always find it. No matter where you start, following the slope downhill always leads to the same optimal point.',
          'The GRADIENT is the slope of this surface at your current position. Formally, it is the partial derivative ∂L/∂w. It tells you two things: (1) which DIRECTION increases the loss (we go the opposite way), and (2) how STEEP the slope is (steep = big update, flat = small update).',
          'The update rule is deceptively simple: w_new = w_old − α × gradient. We SUBTRACT because we want to go OPPOSITE to the gradient direction (downhill, not uphill). The learning rate α controls how big each step is.',
          'An astonishing fact: this same algorithm — conceived by Cauchy in 1847 — is what trains GPT, DALL-E, AlphaFold, and every modern AI system. The scale has grown from 2 parameters to 2 trillion, but the principle is identical: compute the slope, step downhill, repeat.',
          'Watch the ball roll down the loss surface below. Notice how it moves fast when the slope is steep (far from minimum) and slows down as it approaches the bottom (gradient approaches zero). This natural deceleration is a beautiful property of gradient descent!',
        ],
        interactiveType: 'gradient-descent',
      },
      {
        id: 'gradient-3d',
        title: '3D Loss Landscape',
        description: 'Visualizing optimization in weight-bias space',
        content: [
          'In the previous lesson, we saw gradient descent on a 2D curve — one weight, one loss axis. But real models have at least TWO parameters: weight w AND bias b. The loss surface becomes a 3D landscape, and the optimization becomes a journey across terrain.',
          'Imagine a bowl-shaped surface floating in 3D space. The x-axis is the weight w, the y-axis is the bias b, and the HEIGHT is the loss (MSE). The bottom of the bowl is the optimal (w*, b*) pair — the values that minimize prediction error.',
          'For simple linear regression with MSE, this surface is always a smooth bowl (technically, an elliptic paraboloid). This is wonderful news: there is exactly ONE minimum (no local minima traps), and gradient descent will always find it regardless of where you start.',
          'But the bowl might not be perfectly round. If one parameter has a much larger effect on the loss than the other, the bowl becomes elongated — like an egg or a bathtub. This causes gradient descent to zig-zag inefficiently: the gradient points sideways along the narrow dimension rather than straight toward the minimum. Feature scaling (which we will cover later) fixes this by reshaping the bowl into a more circular form.',
          'The gradient in 3D is a VECTOR with two components: [∂L/∂w, ∂L/∂b]. This vector points in the direction of steepest ASCENT (uphill). We move in the opposite direction — steepest DESCENT — by subtracting it.',
          'Each step updates BOTH parameters simultaneously: w -= α × ∂L/∂w and b -= α × ∂L/∂b. Both parameters improve together on every step.',
          'This generalizes to any number of dimensions. A neural network with 1 billion parameters has a loss surface in 1-billion-dimensional space. We cannot visualize it, but gradient descent works the same way: compute the gradient vector (1 billion numbers), step in the opposite direction, repeat. The algorithm does not care about the number of dimensions.',
          'The contour plot below shows the loss landscape from above, like a topographic map. Darker regions are lower loss. The ball navigates from a random starting point to the minimum. Watch the path it takes — notice how it does not go in a straight line!',
        ],
        interactiveType: 'gradient-descent-3d',
      },
      {
        id: 'learning-rate',
        title: 'Learning Rate',
        description: 'The most important hyperparameter',
        content: [
          'The learning rate (α) is a single number that can make or break your entire training run. It controls how big each step is during gradient descent, and getting it right is one of the most important skills in machine learning.',
          'Think of it as how boldly you step when navigating the fog-covered mountain:',
          '⚡ Too HIGH (α = 1.0): You take giant leaps. You overshoot the valley, land on the opposite slope, leap back even further, and bounce back and forth with increasing energy. Eventually you fly off the mountain entirely. This is called DIVERGENCE — the loss INCREASES instead of decreasing. Your model gets WORSE with training.',
          '🐌 Too LOW (α = 0.0001): You take cautious baby steps. Each step is in the right direction, but it takes millions of steps to get anywhere. Training is impractically slow. With a finite compute budget, you might stop training before reaching a good solution.',
          '✅ Just RIGHT (α ≈ 0.01–0.1): You make steady progress. Steps are large enough to make meaningful progress but small enough to not overshoot. You naturally slow down as you approach the minimum because the gradient shrinks. This is CONVERGENCE — the loss decreases steadily toward the minimum.',
          'How do practitioners choose? Several battle-tested strategies: (1) Start with α = 0.01 and see if the loss decreases. If it explodes, divide by 10. If it is too slow, multiply by 3. (2) Try values on a logarithmic scale: 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1.0. (3) Use learning rate schedules that DECREASE α over time — big steps early for fast progress, small steps later for fine-tuning.',
          'Modern optimizers like Adam (2014) automatically adapt the learning rate for EACH parameter independently. Parameters with consistently large gradients get smaller learning rates (to prevent overshooting), and parameters with consistently small gradients get larger ones (to speed up learning). But even Adam has a "base learning rate" that you must choose.',
          'A deep insight: the learning rate creates a fundamental TRADEOFF between speed and stability. Fast convergence risks instability. Stable convergence risks being too slow. The art of training is navigating this tension.',
          'Historical note: the difficulty of choosing the learning rate frustrated researchers for decades. It was one of the reasons neural networks fell out of favor in the 1990s-2000s. The development of adaptive optimizers (Adagrad, RMSprop, Adam) was crucial to the deep learning revolution.',
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
          'In 1986, David Rumelhart, Geoffrey Hinton, and Ronald Williams published "Learning representations by back-propagating errors" — the paper that made neural network training practical. Their key insight: the training loop that gradient descent follows can be applied through LAYERS of computation using the chain rule. But the loop itself is ancient — it is the same iterative procedure Cauchy described in 1847.',
          'Training is the process of ITERATIVELY improving the model. Think of it as a student studying for an exam: read the material, check your answers, identify mistakes, correct your understanding, repeat.',
          '1️⃣ FORWARD PASS: Use current weights to make predictions for all training data. ŷ = wx + b for every data point. This is "taking the exam" — the model answers questions using what it currently knows.',
          '2️⃣ COMPUTE LOSS: Calculate the total error using the cost function (MSE). This single number tells us how bad the current model is. This is "grading the exam" — one score summarizing overall performance.',
          '3️⃣ COMPUTE GRADIENTS: Calculate ∂Loss/∂w and ∂Loss/∂b — the partial derivatives that tell us which direction to adjust each parameter. This is "reviewing the mistakes" — figuring out what to study more.',
          '4️⃣ UPDATE WEIGHTS: Apply the gradient descent update rule: w -= α × ∂L/∂w and b -= α × ∂L/∂b. This is "studying" — actually adjusting the model based on the feedback.',
          '5️⃣ REPEAT: Go back to step 1 with the updated weights. This is "taking another exam" with improved knowledge.',
          'One complete pass through ALL training data is called an EPOCH. Typically, training runs for hundreds or thousands of epochs. Each epoch makes the model slightly better.',
          'CONVERGENCE: As training progresses, the loss decreases rapidly at first (big mistakes are easy to fix), then slows down (fine-tuning is harder). The loss curve looks like a hockey stick lying on its side — steep descent followed by a gradual plateau. When the loss stops decreasing meaningfully, the model has converged.',
          'STOPPING CRITERIA: When do we stop? Three common approaches: (1) Loss stops decreasing (patience: stop after N epochs with no improvement). (2) Validation loss starts increasing (the model is memorizing training data — overfitting). (3) Maximum epoch limit reached (practical time constraint).',
          'Fun fact: training GPT-4 reportedly cost over $100 million in compute. Each "epoch" processed trillions of tokens. But the loop is identical to what you will see below: forward pass → loss → gradients → update → repeat.',
          'Press the Train button below to watch the regression line slowly fit the data points in real time! The loss graph shows convergence — notice the characteristic hockey-stick shape.',
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
          'In 1973, the statistician F.J. Anscombe created a masterpiece of data visualization: four datasets with IDENTICAL statistical summaries — same mean, variance, correlation, and regression line — but completely different patterns. One was linear, one was curved, one had an outlier, and one had a vertical cluster. His point: blindly fitting a line without looking at the data is dangerous.',
          'Linear Regression is powerful, but it has CLEAR limitations. Understanding when it fails is as important as knowing when it works. The best data scientists do not just know how to use tools — they know when NOT to use them.',
          '🔄 Nonlinear Data: If the true relationship is curved (quadratic, exponential, sinusoidal), a straight line cannot capture it. Anscombe\'s second dataset shows this perfectly — the regression line passes through the curve but misses the pattern entirely. The residuals form a clear arc. Solution: use polynomial features, apply a transformation (log, sqrt), or switch to a non-linear model.',
          '🎯 Outliers: A single extreme data point can dramatically shift the entire regression line. This is because MSE squares errors — one point with error 100 contributes 10,000 to the cost, dominating all points with error 5 (which contribute only 25 each). Anscombe\'s third dataset demonstrates this: one outlier pulls the line completely off course. Solution: use robust regression (MAE instead of MSE), identify and investigate outliers (they might be data entry errors or genuine anomalies worth studying).',
          '📉 Underfitting: The model is too simple to capture the pattern. Like a child\'s crayon drawing of a photograph — it captures the general shape but misses all detail. Signs: high training error AND high test error. Solution: add more features, use polynomial features, or try a more complex model.',
          '📈 Overfitting: Adding too many features or polynomial terms makes the model memorize noise instead of learning signal. Like a student who memorizes exact exam answers but cannot solve new problems. Signs: very low training error but HIGH test error. The model works perfectly on known data but fails on new data. Solution: regularization (L1/L2 penalties), reduce features, cross-validation, or simply get more data.',
          '🌊 Heavy Noise: When the signal-to-noise ratio is low, even the "true" relationship is hard to recover. Imagine trying to hear a whisper at a rock concert. No algorithm can predict truly random variation — this is called IRREDUCIBLE error. Solution: collect more data (noise averages out with larger samples), engineer better features that are less noisy, or accept the fundamental limitation.',
          '🔗 Multicollinearity: When features are highly correlated with EACH OTHER (e.g., apartment size in m² and apartment size in ft² — they are literally the same thing in different units), the weights become unstable. The model cannot decide which feature "deserves" the credit, so small data changes cause wild swings in coefficients. Solution: drop redundant features (keep one of the correlated pair), use regularization (Ridge/L2 shrinks correlated weights), or use PCA to create uncorrelated features.',
          'Toggle the scenarios below to see each failure mode in action! Understanding failure is a superpower — it tells you when to trust your model and when to question it.',
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
          'In the early days of AI (1950s–1960s), researchers debated fiercely: do we need complex models, or can simple ones suffice? The debate raged between the "neats" (who favored elegant mathematical models like regression) and the "scruffies" (who wanted messy, brain-inspired approaches like neural networks). Today, we know the answer: it depends on the problem. Choosing the right model is one of the most important skills a data scientist can develop.',
          '📏 Linear Regression: ŷ = wx + b. The workhorse. Pros: blazingly fast (predictions in microseconds), fully interpretable ("each square meter adds $2,000"), works well with limited data (even 30 points can give useful results), nearly impossible to overfit, mathematically well-understood. Cons: cannot capture curves, interactions, or complex patterns. Use when: you suspect a roughly linear relationship, need explainability (medicine, law, finance), or have limited data.',
          '🔄 Polynomial Regression: ŷ = w₁x + w₂x² + w₃x³ + ... + b. The flexible friend. Pros: can model curves and complex shapes while remaining a "linear" model (linear in parameters). Cons: degree too high → overfitting (the Runge phenomenon: wild oscillations at the edges), less interpretable, requires more data, extrapolation is catastrophic (the polynomial shoots to ±infinity outside the training range). Use when: the data has clear curvature but you still want a closed-form equation.',
          '🧠 Neural Networks: output = activation(W₂ × activation(W₁ × x + b₁) + b₂). The universal approximator. Pros: can learn ANY pattern (Universal Approximation Theorem, Cybenko 1989), scales to millions of features and billions of data points, automatically learns feature interactions. Cons: requires lots of data (thousands to millions of examples), slow and expensive to train (GPUs, weeks of compute), black-box (hard to explain WHY a prediction was made), many hyperparameters to tune, prone to overfitting without careful regularization. Use when: you have abundant data and the relationship is highly non-linear or involves raw unstructured data (images, text, audio).',
          'A critical principle that great practitioners live by: START SIMPLE. Try Linear Regression first. If it fails (check the residuals!), try polynomial. Only reach for neural networks when simpler methods are clearly insufficient. This is Occam\'s Razor — the simplest explanation that fits the data is usually the best. In practice, a well-engineered linear model often beats a poorly tuned neural network.',
          'The legendary statistician George Box wrote: "All models are wrong, but some are useful." The goal is not to find the "true" model — it is to find the simplest model that is USEFUL for your specific problem.',
          'Compare them side-by-side below with the same dataset! Notice how linear regression misses curves, polynomial captures them but can oscillate, and neural networks adapt but may overfit with little data.',
        ],
        interactiveType: 'comparison',
      },
      {
        id: 'polynomial-regression',
        title: 'Polynomial Regression',
        description: 'Extending linear regression to curves',
        content: [
          'Here is a surprising fact that confuses many beginners: polynomial regression is actually a form of LINEAR regression. The "linear" refers to being linear in the PARAMETERS (weights), not in the input x. This subtle distinction opens up a world of flexibility.',
          '🔑 The Core Trick — Feature Engineering: Instead of using just x, we CREATE new features from x: x², x³, x⁴, and so on. Then we run standard linear regression on these expanded features. The model learns separate weights for x, x², x³, etc. The math is identical — we just changed the inputs.',
          'Degree 1 (Linear): ŷ = w₁x + b — a straight line. The simplest model.',
          'Degree 2 (Quadratic): ŷ = w₁x + w₂x² + b — a parabola. Can model U-shapes like projectile trajectories, diminishing returns, or the relationship between study time and performance (too much studying eventually has diminishing returns due to fatigue).',
          'Degree 3 (Cubic): ŷ = w₁x + w₂x² + w₃x³ + b — an S-curve. Can model growth with inflection points, like population growth that starts slow, accelerates, then levels off.',
          'Degree n: ŷ = w₁x + w₂x² + ... + wₙxⁿ + b — can model increasingly complex shapes. But with great power comes great responsibility...',
          '⚠️ The Runge Phenomenon (1901): Carl Runge demonstrated that high-degree polynomial interpolation can produce increasingly wild oscillations at the edges of the data range, even when the underlying function is smooth. A degree-20 polynomial might pass through every training point perfectly (MSE = 0) but make predictions that swing to ±1,000,000 just slightly beyond the data. This is a dramatic example of overfitting — the model memorizes noise rather than learning the true pattern.',
          'The Bias-Variance Tradeoff in action: Degree too low → high bias (underfitting, misses the pattern). Degree too high → high variance (overfitting, fits noise). The sweet spot is the lowest degree that captures the true relationship while generalizing to new data.',
          'How it works mathematically: Given data points, we construct the Vandermonde matrix V where row i = [1, xᵢ, xᵢ², ..., xᵢⁿ]. Then we solve the normal equation: W = (VᵀV)⁻¹Vᵀy. This is EXACTLY linear regression — just with engineered features! The beauty is that all the theory (MSE, gradient descent, normal equation) transfers directly.',
          'In practice with scikit-learn: from sklearn.preprocessing import PolynomialFeatures; poly = PolynomialFeatures(degree=3); X_poly = poly.fit_transform(X); model.fit(X_poly, y). Three lines of code to go from linear to polynomial.',
          'Rule of thumb from decades of practice: Start with degree 1. If residuals show a clear curved pattern, try degree 2. Rarely go above degree 3-4 unless you have LOTS of data and domain knowledge justifying the complexity. Always validate on held-out test data, not training data — training MSE always decreases with degree, but test MSE follows a U-shape.',
          'Try it in the Playground! Switch to the Quadratic preset, then enable polynomial fitting and increase the degree. Watch how the curve adapts — and what happens when the degree gets too high. That wild oscillation? That is Runge\'s ghost, still haunting us 120 years later.',
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
          'In 1822, Gauss extended his method of least squares from fitting curves with one variable to systems with MULTIPLE unknowns. He was solving astronomical problems that depended on several orbital parameters simultaneously. This generalization — from one input to many — was a leap that took regression from a curve-fitting trick to a universal prediction engine.',
          'So far we have used ONE feature (x) to predict y. But real-world problems rarely depend on a single variable. A house price depends on size, bedrooms, bathrooms, age, location, floor level, proximity to metro, school quality, crime rate, and dozens more. Using just one feature ignores a wealth of information.',
          'Multivariable Linear Regression extends the equation naturally:',
          'ŷ = w₁x₁ + w₂x₂ + w₃x₃ + ... + wₙxₙ + b',
          'Each feature xᵢ gets its OWN weight wᵢ. The model learns how much each feature independently contributes to the prediction. This is one of regression\'s greatest strengths — it ISOLATES the effect of each variable while accounting for all the others.',
          'Interpretation is powerful and practical: if w₁ (size) = 5,000 and w₂ (bedrooms) = 20,000, it means each extra m² adds 5,000 EGP while each extra bedroom adds 20,000 EGP, HOLDING ALL OTHER FEATURES CONSTANT. This "all else being equal" interpretation is called a PARTIAL effect, and it is exactly what decision-makers need.',
          'In vector notation: ŷ = W · X + b, where W is the weight vector [w₁, w₂, ..., wₙ] and X is the feature vector [x₁, x₂, ..., xₙ]. The dot product computes the weighted sum. This compact notation is not just aesthetic — it maps directly to how GPUs perform computation.',
          'This is EXACTLY what a single neuron computes in a neural network! The only difference: a neuron applies an activation function afterward: output = activation(W · X + b). When you see a neural network diagram with nodes and connections, each connection carries a weight, and each node computes this weighted sum. You already understand the computation.',
          'Gradient descent works the same way, just with more parameters to update. Instead of computing one gradient ∂L/∂w, we compute a gradient VECTOR [∂L/∂w₁, ∂L/∂w₂, ..., ∂L/∂wₙ, ∂L/∂b]. Each weight gets its own gradient, telling us how to adjust it independently.',
          'Adjust the weights below to see how each feature contributes to the house price prediction! Notice how changing one weight affects the prediction while others stay fixed.',
        ],
        interactiveType: 'multivariate',
      },
      {
        id: 'matrix-formulation',
        title: 'Matrix Formulation',
        description: 'Linear algebra behind the scenes',
        content: [
          'In 1855, Arthur Cayley published the first systematic treatment of matrix algebra. He could not have imagined that matrices would become the language of machine learning 160 years later — but the tools he created are exactly what we need to express regression compactly and compute it efficiently.',
          'With multiple features and many data points, individual equations become unwieldy. Imagine writing ŷ₁ = w₁x₁₁ + w₂x₁₂ + w₃x₁₃ + b for every single data point. With 10,000 samples and 100 features, that is 10,000 equations with 100 terms each. Matrix notation collapses all of this into one elegant line:',
          'X is an (m × n) matrix: m samples (rows), n features (columns). Each row is one data point\'s feature values. Each column is one feature across all samples.',
          'W is an (n × 1) weight vector. b is a scalar bias (broadcast to all rows).',
          'Predictions for ALL samples at once: Ŷ = XW + b. This single matrix multiplication replaces m separate equations. A GPU can compute millions of predictions in milliseconds using parallelized matrix multiplication — this is why NVIDIA became a trillion-dollar company.',
          'The Normal Equation gives the OPTIMAL weights in one step, with no iteration needed:',
          'W* = (XᵀX)⁻¹Xᵀy',
          'This is mathematically beautiful — one formula gives the provably best weights. Gauss derived this in 1822, and it remains the fastest solution for small-to-medium problems. But there is a catch: computing (XᵀX)⁻¹ requires O(n³) time and O(n²) memory. With 1,000 features, that is 1 BILLION operations. With 100,000 features (common in NLP), it is computationally impossible.',
          'That is why gradient descent exists as an alternative: it is O(m × n) per step, which scales much better to large feature spaces. For small problems (n < 10,000), use the Normal Equation — it is exact and fast. For larger problems, use gradient descent — it is approximate but scalable.',
          'Fun fact: when you call model.fit() in scikit-learn\'s LinearRegression, it uses the Normal Equation by default (via a numerically stable variant called SVD decomposition). When you use SGDRegressor, it uses gradient descent. Same goal, different computational strategies.',
        ],
        image: '/illustrations/matrix-formulation.svg',
      },
      {
        id: 'feature-scaling',
        title: 'Feature Scaling',
        description: 'Why normalization matters',
        content: [
          'Consider two features: apartment size (50–500 m²) and number of bedrooms (1–6). The raw scales differ by 100×. This seems like a minor inconvenience, but it causes MAJOR problems for gradient descent.',
          'Without scaling, the loss surface becomes a narrow, elongated ellipse instead of a circle. Imagine a valley that is 1 km long but only 10 meters wide. The gradient at any point mostly points across the narrow dimension, causing a zig-zag path along the length of the valley. You take 1,000 steps to traverse what should take 10. Gradient descent wastes most of its effort oscillating side-to-side instead of heading toward the minimum.',
          'Two standard scaling methods, both developed by statisticians in the early 20th century:',
          '📏 Min-Max Normalization: x\' = (x - min) / (max - min). Scales all values to [0, 1]. Preserves the original distribution shape. Good when you know the range and there are no extreme outliers. Used extensively in image processing (pixel values 0-255 → 0-1).',
          '📊 Standardization (Z-score): x\' = (x - μ) / σ. Centers at mean=0, scales to std=1. More robust to outliers because the mean and std are less affected by extreme values than min and max. The default choice in practice. Also called "standard scaling" in scikit-learn.',
          'After scaling, all features have comparable magnitudes. The loss surface becomes more circular, and gradient descent converges in a near-straight path to the minimum — often 10-100× faster! The improvement can be dramatic: a problem that took 10,000 epochs might converge in 100.',
          'CRITICAL WARNING: Fit the scaler on TRAINING data only, then transform both train and test data with the SAME parameters (same mean, same std). If you fit on the full dataset including test data, you are leaking future information into training — this is called DATA LEAKAGE, and it makes your evaluation metrics lie. The pipeline should be: split → fit scaler on train → transform train → transform test with same scaler.',
          'Scaling does NOT change the model\'s final predictions — the weights adjust to compensate. A weight of 5,000 on an unscaled feature (range 50-500) becomes a weight of 2,500,000 on a scaled feature (range 0-1). Same predictions, same model, but dramatically different training dynamics.',
          'Press Train below to see how scaling dramatically speeds up convergence! The difference is visible within seconds.',
        ],
        interactiveType: 'feature-scaling',
      },
      {
        id: 'feature-selection',
        title: 'Feature Selection & Engineering',
        description: 'Choosing the right inputs',
        content: [
          'In the 1960s, as computers enabled regression with more features, researchers discovered something counterintuitive: adding MORE features sometimes made predictions WORSE. This phenomenon, later formalized as the "curse of dimensionality" by Richard Bellman, taught a crucial lesson — quality of features matters more than quantity.',
          '🎯 Feature Selection: Keep only features that actually help prediction. Irrelevant features add noise, increase computation, and can cause overfitting. Methods include:',
          '• Correlation analysis: Compute the Pearson correlation between each feature and the target. Drop features with near-zero correlation — they are noise that dilutes the signal.',
          '• Recursive Feature Elimination (RFE): Train the model, identify the least important feature (smallest |weight|), remove it, retrain. Repeat until performance starts dropping. Keep the survivors.',
          '• L1 Regularization (Lasso): Adds a penalty |w| that automatically drives unimportant weights to exactly ZERO, effectively performing feature selection during training. Developed by Robert Tibshirani in 1996, it was a breakthrough — the model itself decides which features matter.',
          '🔗 Multicollinearity: When features correlate with EACH OTHER (e.g., house size and number of rooms are highly correlated), the model cannot separate their individual effects. The weights become unstable — small changes in training data cause wild swings in coefficients, even though predictions remain similar. It is like trying to determine whether it is the engine or the fuel making the car go fast — when they always increase together, you cannot tell.',
          'Detection: Calculate the Variance Inflation Factor (VIF) for each feature. VIF > 10 means severe multicollinearity — that feature\'s variance is inflated 10× by correlation with others. Solution: drop one of the correlated pair, combine them into a single feature, or use Ridge (L2) regularization which handles multicollinearity gracefully.',
          '🛠️ Feature Engineering: Create NEW features from existing ones to capture patterns the model cannot discover on its own:',
          '• Interaction terms: size × bedrooms captures the premium for large bedrooms specifically. A 50m² apartment with 1 bedroom is very different from 50m² with 4 bedrooms.',
          '• Polynomial features: x² captures curvature while still using linear regression machinery.',
          '• Domain-specific: price_per_sqm = price / size reveals neighborhood quality independent of apartment size. age_of_building = current_year - year_built is more useful than raw year_built.',
          '• Categorical encoding: "neighborhood" becomes multiple binary features: is_downtown, is_suburbs, is_waterfront. Each gets its own weight.',
          'Andrew Ng, the Stanford professor who helped launch the deep learning revolution, famously said: "Applied machine learning is basically feature engineering." Good features with a simple model almost always beat raw features with a complex model.',
        ],
        image: '/illustrations/feature-selection.svg',
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
          'In 1854, Florence Nightingale arrived at a military hospital during the Crimean War and was horrified by the death toll. But she did not just feel — she MEASURED. She collected meticulous data and created one of history\'s first statistical graphics: a polar area diagram showing that most soldiers died from preventable diseases, not combat wounds. Her visualizations convinced the British government to reform military hospitals, saving thousands of lives. Data visualization is not just a nice-to-have — it can change the world.',
          'The best data scientists follow Nightingale\'s example. They do NOT start by running algorithms. They start by LOOKING at their data. Visualization is your first and most powerful tool — a trained eye catches patterns that algorithms miss.',
          'A scatter plot is your primary weapon. Plot feature (x) vs. target (y) and look for patterns with your eyes before trusting any algorithm. John Tukey, the father of exploratory data analysis, said: "The greatest value of a picture is when it forces us to notice what we never expected to see."',
          '📈 Strong positive correlation (r ≈ +0.9): Points form a tight upward band. As x increases, y increases predictably. Example: study hours vs. exam score. The relationship is reliable — knowing x gives you a good prediction of y.',
          '📉 Strong negative correlation (r ≈ -0.9): Points form a tight downward band. As x increases, y decreases. Example: car age vs. resale value. The older the car, the less it is worth.',
          '🎯 No correlation (r ≈ 0): Points form a random cloud with no directional trend. x and y are linearly unrelated. Example: shoe size vs. exam score.',
          '⚠️ Non-linear pattern (r ≈ 0 but clear pattern): This is the TRAP. Points form a clear curve, but Pearson r (which only measures LINEAR relationships) reports near-zero correlation. Example: drug dosage vs. effectiveness — too little does nothing, moderate amounts help, too much causes harm (inverted U-shape). The lesson: ALWAYS plot before computing. A single number can never capture the full story.',
          'The Pearson correlation coefficient r ranges from -1 (perfect negative linear) to +1 (perfect positive linear). It was formalized by Karl Pearson in 1896, building on Galton\'s work with heights. But remember: r only captures LINEAR relationships! Anscombe\'s Quartet (1973) proved this dramatically — four datasets with identical r values but completely different patterns.',
          'Draw points below and see if you can create strong, weak, and no correlations! The app calculates r in real time. Try to create a clear curved pattern with r near zero — feel why r alone is not enough.',
        ],
        interactiveType: 'correlation',
      },
      {
        id: 'correlation-causation',
        title: 'Correlation ≠ Causation',
        description: 'The most dangerous mistake in data science',
        content: [
          'This is arguably the most important lesson in all of data science — and in critical thinking more broadly. Getting this wrong has led to disastrous policy decisions, wasted billions in healthcare spending, retracted scientific papers, and harmful public health advice.',
          'The Latin phrase "cum hoc ergo propter hoc" (with this, therefore because of this) describes the logical fallacy of assuming that because two things happen together, one must cause the other. Humans are hardwired to see causation in correlation — it was useful for survival (eat berry → get sick → avoid berry), but it misleads in complex systems.',
          '🍦 Ice cream sales and drowning deaths correlate at r ≈ 0.85 every summer. Does ice cream cause drowning? NO! Both are caused by a CONFOUNDING VARIABLE: hot weather makes people buy ice cream AND go swimming. If a city banned ice cream sales, drowning deaths would not change.',
          '👟 Children with bigger feet read better. Do shoes make you smarter? NO! Age is the hidden variable — older kids have bigger feet AND better reading skills. Buying bigger shoes for a 5-year-old would not improve their reading.',
          '📺 Countries that consume more chocolate win more Nobel Prizes (r ≈ 0.79, published in the New England Journal of Medicine in 2012). Does chocolate make geniuses? NO! Wealthy countries can afford both premium chocolate and world-class research institutions. GDP is the confound.',
          '🦈 Shark attacks and ice cream sales both peak in summer. Should we ban ice cream to prevent shark attacks? Of course not — summer heat drives both independently.',
          '📱 A real-world disaster: in the 1990s, a study found that children who slept with the light on were more likely to develop myopia (nearsightedness). Parents panicked. But a follow-up study discovered the REAL cause: nearsighted PARENTS (genetically likely to have nearsighted children) were more likely to leave the light on because they themselves could not see well in the dark. The light was a confound, not a cause.',
          'Three types of causal relationships to distinguish:',
          '• Direct causation: Smoking → Lung cancer (proven through decades of controlled studies and biological mechanism). The gold standard requires randomized controlled trials or strong mechanistic evidence.',
          '• Reverse causation: Does crime cause poverty, or does poverty cause crime? The arrow might go either way! Without intervention studies, correlation alone cannot tell you the direction.',
          '• Confounding: A hidden third variable causes BOTH observed variables. This is the most common trap, and it is everywhere. The solution: look for confounders, design controlled experiments, or use statistical techniques like instrumental variables.',
          'Machine learning models find CORRELATIONS — they fundamentally cannot determine causation from observational data alone. Only randomized controlled experiments (A/B tests, clinical trials) can establish causation. A model might discover that "ice cream sales predict drowning" and technically make correct predictions — but acting on it (banning ice cream) would be absurd.',
          'This is why domain knowledge and critical thinking matter as much as algorithms. A model is a tool — you are the thinker who decides whether its findings are meaningful or spurious.',
        ],
        image: '/illustrations/correlation-causation.svg',
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
          'The bias-variance tradeoff is the CENTRAL dilemma in all of machine learning — arguably the single most important concept you will ever learn. It explains why more complex models are not always better, why training accuracy can be misleading, and why the simplest adequate model usually wins.',
          'The concept was formalized in the 1990s by researchers like Stuart Geman and Scott Bias, but practitioners had observed it for decades. Even Gauss, fitting polynomial orbits to astronomical data in the 1800s, knew that using too many parameters led to wild predictions beyond the observed data.',
          '📖 Underfitting (High Bias, Low Variance): The model is too SIMPLE to capture the real pattern. Like a student who barely studied — they know the general topic but miss all nuances and specifics. A straight line fit to clearly curved data. Predictions are consistently wrong in the same systematic way, regardless of which training data you use.',
          '🤓 Overfitting (Low Bias, High Variance): The model is too COMPLEX, memorizing the training data including its noise and quirks. Like a student who memorized the textbook word-for-word — they ace practice tests (training data) but fail on new questions (test data) because they never understood the underlying concepts. A degree-15 polynomial that wiggles through every training point but makes absurd predictions on new data.',
          '✅ Good Fit (Balanced): The model captures the TRUE underlying pattern without memorizing noise. Like a student who understood the CONCEPTS — they can answer questions they have never seen because they grasped the principles, not just the examples.',
          'BIAS: How far off the model\'s average predictions are from the truth. Imagine training the same model on 100 different random samples of the same population. High bias means the average of all 100 models\' predictions is far from the true value — every model "misses the target center" in the same direction.',
          'VARIANCE: How much the model\'s predictions SCATTER when trained on different data samples. High variance means the 100 models give wildly different predictions — each one is tuned to its specific training sample rather than the underlying pattern.',
          'The mathematical decomposition: Expected Error = Bias² + Variance + Irreducible Noise. You can reduce bias by making the model more complex, but this increases variance. You can reduce variance by simplifying the model, but this increases bias. The art is finding the sweet spot that minimizes the SUM.',
          'Experiment below: slide the polynomial degree and watch the model go from underfitting → good fit → overfitting. Pay close attention to train MSE vs test MSE — when they diverge, you are overfitting!',
        ],
        interactiveType: 'bias-variance',
      },
      {
        id: 'train-test-split',
        title: 'Train/Test Split',
        description: 'How to honestly evaluate your model',
        content: [
          'If you test your model on the SAME data it trained on, it is like grading a student on exactly the questions they practiced. Of course they will score well — but can they handle new questions? This is the fundamental problem of model evaluation, and the train/test split is the solution.',
          'The idea was formalized by Seymour Geisser in the 1970s with his work on predictive inference, and it has become the single most important practice in applied machine learning. Violating it is considered a cardinal sin — papers have been retracted, products have failed, and careers have been derailed by this mistake.',
          'The solution: BEFORE training, randomly split your data into separate sets:',
          '🏋️ Training set (typically 70-80%): The model learns from this data. Only this data is used during gradient descent. The model adjusts weights to minimize loss on these examples.',
          '🧪 Test set (typically 20-30%): The model is evaluated on this data which it has NEVER seen during training. This simulates real-world performance — how well does the model generalize to genuinely new inputs?',
          '📊 Validation set (optional, ~10-15%): Used to tune hyperparameters (learning rate, polynomial degree, regularization strength) without touching the test set. Think of it as "practice exams" versus the "final exam" (test set).',
          'How to diagnose your model using train vs test error:',
          '• High train error + High test error → UNDERFITTING. Model is too simple. Solution: add features, increase complexity, train longer.',
          '• Low train error + High test error → OVERFITTING. Model memorized training data. Solution: simplify model, add regularization, get more training data.',
          '• Low train error + Low test error → GREAT! The model generalizes well. 🎉 Ship it!',
          '• High train error + Low test error → Very rare. Usually means a bug, data leakage, or an extremely small test set that got lucky.',
          'GOLDEN RULE: Never, EVER peek at your test set during training or hyperparameter tuning. That is DATA LEAKAGE — the cardinal sin of machine learning. It gives you falsely optimistic results that will CRASH in production. The test set must be a sealed envelope that you open only once, at the very end.',
          'K-Fold Cross Validation: For small datasets where you cannot afford to "waste" 20% on testing, split into K parts (typically K=5 or K=10). Train on K-1 parts, test on the remaining one. Rotate which part is the test set. Average the K results. This gives a more reliable estimate than a single random split and uses ALL data for both training and testing (just not simultaneously). Developed by M. Stone in 1974.',
        ],
        image: '/illustrations/train-test-split.svg',
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
          'MSE is not the only way to measure model quality. Just as a doctor uses multiple vital signs (temperature, blood pressure, heart rate) to assess health, a data scientist uses multiple metrics to understand model performance from different angles. Choosing the right metric can be as important as choosing the right model.',
          '📏 MAE (Mean Absolute Error) = (1/n) × Σ|yᵢ - ŷᵢ|. The simplest metric — the average of absolute errors. Intuitive interpretation: "on average, predictions are off by X units." Not sensitive to outliers because errors are NOT squared — an error of 10 contributes 10, not 100. Use when all errors are equally important regardless of size (e.g., predicting delivery time — a 5-minute error is 5× worse than a 1-minute error, not 25× worse).',
          '📐 RMSE (Root Mean Squared Error) = √MSE. Same units as the target variable (unlike MSE which is in squared units — "dollars squared" is meaningless). Penalizes large errors disproportionately because of the squaring inside. Use when big errors are catastrophically bad (e.g., predicting bridge load capacity — being off by a lot is not just "more wrong," it is potentially deadly).',
          '📊 R² (Coefficient of Determination) = 1 - (SS_res / SS_total). Developed by Sewall Wright in 1921, R² answers the question: "What fraction of the variance in y does our model explain?" It compares your model to the simplest possible baseline: always predicting the mean.',
          'R² = 1.0 → Perfect predictions. R² = 0.0 → Model is no better than always predicting the mean (your "model" adds no value). R² < 0 → Model is WORSE than the mean — it is actively harmful! This can happen with a truly terrible model or when evaluating on very different data.',
          'Comparing metrics on a concrete example: predictions [10, 12, 15] vs actuals [11, 10, 14]. MAE = (1+2+1)/3 = 1.33, MSE = (1+4+1)/3 = 2.0, RMSE = √2.0 = 1.41. Notice MSE is highest because of the squared error of 2. The single "bad" prediction (12 vs 10) dominates MSE but has proportional impact on MAE.',
          'MAPE (Mean Absolute Percentage Error): (1/n) × Σ(|yᵢ - ŷᵢ|/|yᵢ|) × 100%. Useful for comparing across different scales: "predictions are off by 5% on average." A $5 error on a $100 item (5%) is different from a $5 error on a $10,000 item (0.05%). But MAPE breaks catastrophically when actual values are near zero (division by zero) and is asymmetric — overestimates and underestimates of the same magnitude give different percentages.',
          'Choosing your metric depends on the BUSINESS problem, not the math. For predicting delivery time: use MAE (customers care linearly about delays). For structural engineering: use RMSE (large errors are dangerous). For comparing models across datasets with different scales: use R². For business reporting: use MAPE (stakeholders think in percentages). There is no single "best" metric — only the right metric for your context.',
          'A wise practice: always report MULTIPLE metrics. If one metric looks great but another looks terrible, that discrepancy reveals something important about your model\'s error distribution.',
          'Adjust the regression line below and see how all metrics respond differently to the same change!',
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
          'We have arrived at the grand finale — the moment where everything connects. And the connection is more beautiful and direct than you might expect.',
          'In 1943, neurophysiologist Warren McCulloch and logician Walter Pitts published "A Logical Calculus of Ideas Immanent in Nervous Activity." They proposed the first mathematical model of a biological neuron — a weighted sum of inputs followed by a threshold. The math: output = threshold(w₁x₁ + w₂x₂ + ... + b). Look familiar? It should.',
          'A single artificial neuron computes: output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)',
          'Look at the inside of the activation: w₁x₁ + w₂x₂ + ... + wₙxₙ + b. That is EXACTLY multivariable linear regression! ŷ = W·X + b. The computation you have spent this entire course mastering IS the core computation of every neuron in every neural network.',
          'Remove the activation function → a single neuron IS linear regression. The concepts map one-to-one:',
          '• Weights (w) = the slopes/coefficients from Module 3. Each weight determines how much one input influences the output.',
          '• Bias (b) = the intercept from Module 3. The output when all inputs are zero.',
          '• Forward pass = making predictions (Module 6). Plug inputs in, compute the weighted sum, get the output.',
          '• Loss function = MSE or cross-entropy (Module 4). The metric that defines "wrong."',
          '• Gradient descent = the same algorithm from Module 5, step-by-step downhill optimization.',
          '• Backpropagation = the chain rule applied to compute gradients through multiple layers. It was popularized by Rumelhart, Hinton, and Williams in 1986, but the math is just calculus — the same derivatives you compute for a single neuron, chained together.',
          'In 1957, Frank Rosenblatt built the Perceptron at the Cornell Aeronautical Laboratory — the first trainable artificial neuron. It could learn to classify simple patterns by adjusting its weights using a learning rule almost identical to gradient descent. The media went wild, with the New York Times proclaiming it the "embryo of an electronic computer that [the Navy] expects will be able to walk, talk, see, write, reproduce itself and be conscious of its existence."',
          'Training a modern neural network with billions of parameters uses the SAME gradient descent you already mastered — just with more parameters and the chain rule to propagate gradients backward through layers. You already understand the CORE of deep learning.',
          'Watch below as we build from 1 neuron (linear regression) → add an activation function → stack into hidden layers → form a complete network. At every step, y = wx + b is there.',
        ],
        interactiveType: 'neuron-bridge',
      },
      {
        id: 'beyond-linear',
        title: 'Why We Need Layers',
        description: 'Breaking the linearity barrier',
        content: [
          'Linear regression can only model straight lines (or flat hyperplanes in higher dimensions). But the real world is full of curves, thresholds, interactions, and complex patterns that no line can capture. To go beyond, we need to understand why linearity is a barrier — and how to break through it.',
          'A critical mathematical fact that shook the AI community in 1969: Marvin Minsky and Seymour Papert published "Perceptrons," proving that a single-layer network (linear model) CANNOT learn the XOR function — a simple pattern where the output is 1 when inputs differ and 0 when they match. This mathematical impossibility proof caused the first "AI Winter" — funding dried up and researchers abandoned neural networks for over a decade.',
          'The deeper reason: stacking linear transformations does NOT help. If f(x) = ax + b and g(x) = cx + d, then g(f(x)) = c(ax + b) + d = (ca)x + (cb + d) — still a linear function! No matter how many linear layers you stack — 2, 100, 1,000 — you get another linear function. More layers with only linear operations are mathematically equivalent to a single layer.',
          'The ACTIVATION FUNCTION is what breaks this limitation. It introduces non-linearity between layers, allowing the network to bend and curve through data space. Common choices, each with its own story:',
          '• Sigmoid(x) = 1/(1+e⁻ˣ): Developed in the 1800s for population modeling. Squishes output to (0,1). Used for binary probabilities. Dominated early neural networks but falls victim to the "vanishing gradient" problem in deep networks.',
          '• Tanh(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ): Like sigmoid but centered at 0. Output range (-1,1). Better gradients than sigmoid. Used in LSTMs and older architectures.',
          '• ReLU(x) = max(0, x): Proposed for neural networks by Nair and Hinton in 2010. Deceptively simple — just "if negative, output zero." But this simple bend at zero, repeated across millions of neurons, allows networks to approximate any shape. ReLU solved the vanishing gradient problem and became the default activation, enabling the deep learning revolution.',
          'With just ONE hidden layer + non-linear activation, a neural network can approximate ANY continuous function to arbitrary precision. This is the Universal Approximation Theorem, proven by George Cybenko in 1989 and Kurt Hornik in 1991. It does not say HOW MANY neurons you need (could be enormous), but it guarantees the capability exists.',
          'Deeper networks can learn HIERARCHICAL representations — the key insight that makes deep learning "deep." In image recognition: Layer 1 learns edges (vertical, horizontal, diagonal). Layer 2 combines edges into shapes (circles, rectangles). Layer 3 combines shapes into parts (eyes, wheels, windows). Layer 4 combines parts into objects (faces, cars, houses). Each layer builds on the previous one, creating increasingly abstract representations.',
          'Your journey through this course traces the arc of AI itself: y = wx + b (Gauss, 1795) → ŷ = W·X + b (Gauss, 1822) → activation(W·X + b) (McCulloch & Pitts, 1943) → Deep Networks (Hinton et al., 1986) → Transformers (Vaswani et al., 2017) → LLMs (2022+) 🚀',
          'Everything you learned — cost functions, gradient descent, the training loop, bias-variance, evaluation metrics, feature engineering — applies DIRECTLY to neural networks and deep learning. The scale changes, the architectures evolve, but the DNA remains: y = wx + b. You have not just learned linear regression — you have built the foundation of modern AI. The line continues.',
        ],
        image: '/illustrations/beyond-linear.svg',
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

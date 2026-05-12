'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <defs>
        <linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="py-a">
          <stop stopColor="#387EB8" offset="0%" />
          <stop stopColor="#366994" offset="100%" />
        </linearGradient>
        <linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="py-b">
          <stop stopColor="#FFC836" offset="0%" />
          <stop stopColor="#FFD43B" offset="100%" />
        </linearGradient>
      </defs>
      <path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="url(#py-a)" />
      <path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="url(#py-b)" />
    </svg>
  );
}

function JavaScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path d="M0 0h256v256H0V0z" fill="#F7DF1E" />
      <path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247L210.29 147.43c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574" />
    </svg>
  );
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path d="M0 128V0h256v256H0z" fill="#3178C6" />
      <path d="M56.612 128.85l-.081 10.483h33.32v94.68h23.568v-94.68h33.321v-10.28c0-5.69-.122-10.444-.284-10.566-.122-.162-20.4-.244-44.983-.203l-44.74.122-.122 10.443zM206.567 118.108c6.501 1.626 11.459 4.51 16.01 9.224 2.357 2.52 5.851 7.111 6.136 8.208.08.366-11.134 7.84-17.879 12.024-.244.162-1.22-.89-2.317-2.52-3.29-4.795-6.745-6.867-12.028-7.233-7.76-.528-12.759 3.535-12.718 10.321 0 1.992.284 3.17 1.097 4.795 1.707 3.536 4.876 5.649 14.832 9.956 18.326 7.882 26.168 13.084 31.045 20.48 5.445 8.249 6.664 21.415 2.966 31.208-4.063 10.646-14.14 17.879-28.323 20.276-4.388.772-14.79.65-19.504-.203-10.28-1.828-20.033-6.908-26.047-13.572-2.357-2.6-6.949-9.426-6.664-9.874.122-.163 1.178-.813 2.356-1.504 1.138-.65 5.446-3.129 9.509-5.486l7.355-4.267 1.544 2.276c2.154 3.29 6.867 7.801 9.712 9.305 8.167 4.307 19.383 3.698 24.909-1.26 2.357-2.153 3.332-4.388 3.332-7.68 0-2.966-.366-4.266-1.91-6.501-1.99-2.845-6.054-5.242-17.595-10.24-13.206-5.69-18.895-9.224-24.096-14.832-3.007-3.25-5.852-8.452-7.03-12.8-.975-3.617-1.22-12.678-.447-16.335 2.723-12.76 12.353-21.659 26.25-24.3 4.51-.853 14.994-.528 19.424.61z" fill="#FFF" />
    </svg>
  );
}

const languageIcons: Record<string, ReactNode> = {
  Python: <PythonIcon className="w-5 h-5" />,
  JavaScript: <JavaScriptIcon className="w-5 h-5 rounded" />,
  TypeScript: <TypeScriptIcon className="w-5 h-5 rounded" />,
};

interface CodeExample {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  tags: string[];
  code: string;
  explanation: string[];
}

const examples: CodeExample[] = [
  // ──────── PYTHON ────────
  {
    id: 'py-sklearn',
    title: 'Linear Regression with scikit-learn',
    description: 'The fastest way to fit a linear regression model in Python using the industry-standard library.',
    difficulty: 'beginner',
    language: 'Python',
    tags: ['scikit-learn', 'fit/predict', 'basics'],
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data: house size → price
np.random.seed(42)
X = np.random.rand(100, 1) * 2000 + 500     # sizes: 500–2500 sqft
y = 150 * X.squeeze() + 50000 + np.random.randn(100) * 20000  # price

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and fit model
model = LinearRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Results
print(f"Slope (w):     {model.coef_[0]:.2f}")
print(f"Intercept (b): {model.intercept_:.2f}")
print(f"R² Score:      {r2_score(y_test, y_pred):.4f}")
print(f"RMSE:          {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")

# Predict a new house
new_house = np.array([[1500]])
print(f"\\nPredicted price for 1500 sqft: \${model.predict(new_house)[0]:,.0f}")`,
    explanation: [
      'LinearRegression() creates the model — it learns ŷ = w·x + b',
      'fit() finds the optimal weights using the Normal Equation (closed-form solution)',
      'predict() computes ŷ for new inputs by applying the learned formula',
      'R² measures how much variance your model explains (1.0 = perfect)',
      'RMSE is in the same units as your target — easy to interpret',
    ],
  },
  {
    id: 'py-scratch',
    title: 'Linear Regression from Scratch',
    description: 'Build gradient descent from zero — no libraries. Understand every single step.',
    difficulty: 'intermediate',
    language: 'Python',
    tags: ['from scratch', 'gradient descent', 'numpy'],
    code: `import numpy as np

class LinearRegressionGD:
    """Linear Regression using Gradient Descent — built from scratch."""
    
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = None
        self.loss_history = []
    
    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for epoch in range(self.epochs):
            # Forward pass: ŷ = X·w + b
            y_pred = X @ self.weights + self.bias
            
            # Compute MSE loss
            loss = np.mean((y - y_pred) ** 2)
            self.loss_history.append(loss)
            
            # Compute gradients
            dw = -(2 / n_samples) * (X.T @ (y - y_pred))
            db = -(2 / n_samples) * np.sum(y - y_pred)
            
            # Update parameters
            self.weights -= self.lr * dw
            self.bias -= self.lr * db
            
            if epoch % 200 == 0:
                print(f"Epoch {epoch:4d} | Loss: {loss:.4f}")
        
        return self
    
    def predict(self, X):
        return X @ self.weights + self.bias


# Demo
np.random.seed(42)
X = np.random.rand(200, 1) * 10
y = 3 * X.squeeze() + 7 + np.random.randn(200) * 2  # true: y = 3x + 7

model = LinearRegressionGD(learning_rate=0.01, epochs=1000)
model.fit(X, y)

print(f"\\nLearned:  ŷ = {model.weights[0]:.3f}·x + {model.bias:.3f}")
print(f"Truth:    y = 3.000·x + 7.000")
print(f"Final Loss: {model.loss_history[-1]:.4f}")`,
    explanation: [
      'We initialize weights to 0 and iteratively improve them',
      'Forward pass: compute predictions ŷ = X·w + b (matrix multiplication)',
      'Loss = MSE = average of (actual - predicted)² across all samples',
      'Gradients tell us which direction to adjust weights to reduce loss',
      'dw = ∂Loss/∂w and db = ∂Loss/∂b — the partial derivatives',
      'Update rule: w = w - lr * dw (move opposite to gradient direction)',
      'Learning rate controls step size — too big = diverge, too small = slow',
    ],
  },
  {
    id: 'py-multivariate',
    title: 'Multivariable Regression + Feature Scaling',
    description: 'Multiple features, standardization, and interpreting coefficients.',
    difficulty: 'intermediate',
    language: 'Python',
    tags: ['multivariate', 'scaling', 'pandas'],
    code: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# Create dataset: house features → price
np.random.seed(42)
n = 200
data = pd.DataFrame({
    'size_sqft': np.random.randint(600, 3000, n),
    'bedrooms':  np.random.randint(1, 6, n),
    'age_years': np.random.randint(0, 50, n),
    'distance_downtown_km': np.random.uniform(0.5, 30, n),
})
data['price'] = (
    150 * data['size_sqft']
    + 25000 * data['bedrooms']
    - 1000 * data['age_years']
    - 5000 * data['distance_downtown_km']
    + 50000
    + np.random.randn(n) * 30000
)

print(data.head())
print(f"\\nCorrelation with price:\\n{data.corr()['price'].drop('price').round(3)}")

# Prepare features
X = data[['size_sqft', 'bedrooms', 'age_years', 'distance_downtown_km']]
y = data['price']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Scale features for fair comparison
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Fit model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Interpret coefficients
print("\\n📊 Feature Importance (standardized coefficients):")
for name, coef in sorted(
    zip(X.columns, model.coef_), key=lambda x: abs(x[1]), reverse=True
):
    direction = "↑" if coef > 0 else "↓"
    print(f"  {direction} {name:25s} {coef:>12,.0f}")

y_pred = model.predict(X_test_scaled)
print(f"\\nR² Score: {r2_score(y_test, y_pred):.4f}")`,
    explanation: [
      'Multiple features (size, bedrooms, age, distance) each have different scales',
      'StandardScaler normalizes features to mean=0, std=1 — crucial for fair coefficient comparison',
      'Always fit scaler on train data only, then transform both train and test',
      'Standardized coefficients show relative importance: bigger |coef| = more influential feature',
      'The sign (+/-) tells direction: positive = price increases, negative = price decreases',
    ],
  },
  {
    id: 'py-evaluation',
    title: 'Complete Model Evaluation Pipeline',
    description: 'Cross-validation, residual analysis, and detecting when your model is wrong.',
    difficulty: 'advanced',
    language: 'Python',
    tags: ['evaluation', 'cross-validation', 'diagnostics'],
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, KFold
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

np.random.seed(42)
X = np.random.rand(300, 3) * 10
y = 2*X[:,0] - 3*X[:,1] + 0.5*X[:,2] + 10 + np.random.randn(300) * 3

model = LinearRegression()

# ──── K-Fold Cross Validation ────
kf = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X, y, cv=kf, scoring='r2')
print("📋 5-Fold Cross Validation:")
print(f"   R² scores: {cv_scores.round(4)}")
print(f"   Mean R²:   {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# ──── Full Metrics Suite ────
model.fit(X[:240], y[:240])  # 80% train
y_pred = model.predict(X[240:])
y_true = y[240:]

mae  = mean_absolute_error(y_true, y_pred)
mse  = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_true, y_pred)

print(f"\\n📊 Test Set Metrics:")
print(f"   MAE:  {mae:.3f}  (avg absolute error)")
print(f"   MSE:  {mse:.3f}  (penalizes large errors)")
print(f"   RMSE: {rmse:.3f} (same units as target)")
print(f"   R²:   {r2:.4f}  ({r2*100:.1f}% variance explained)")

# ──── Residual Analysis ────
residuals = y_true - y_pred
print(f"\\n🔍 Residual Diagnostics:")
print(f"   Mean residual:     {residuals.mean():.4f}  (should be ~0)")
print(f"   Std residual:      {residuals.std():.4f}")
print(f"   Max |residual|:    {np.abs(residuals).max():.4f}")
print(f"   Skewness:          {float(np.mean((residuals - residuals.mean())**3) / residuals.std()**3):.4f}  (should be ~0)")

# ──── Learned Coefficients ────
print(f"\\n🎯 Learned vs True:")
true_w = [2, -3, 0.5]
for i, (learned, true) in enumerate(zip(model.coef_, true_w)):
    diff = abs(learned - true)
    print(f"   w{i}: learned={learned:+.3f}  true={true:+.3f}  error={diff:.3f}")
print(f"   b:  learned={model.intercept_:+.3f}  true=+10.000")`,
    explanation: [
      'K-Fold CV splits data into K parts, trains on K-1 and tests on 1, repeating K times',
      'Mean ± std of CV scores shows how stable your model is across different data splits',
      'MAE is robust to outliers; MSE/RMSE penalize large errors more heavily',
      'Residual analysis checks model assumptions: residuals should be random, centered at 0',
      'Non-zero mean residual or high skewness suggests systematic prediction errors',
      'Comparing learned vs true coefficients verifies the model recovers the real relationship',
    ],
  },

  // ──────── JAVASCRIPT ────────
  {
    id: 'js-scratch',
    title: 'Linear Regression in JavaScript',
    description: 'Pure JS implementation — no dependencies. Great for web apps and Node.js.',
    difficulty: 'beginner',
    language: 'JavaScript',
    tags: ['vanilla JS', 'from scratch', 'web-ready'],
    code: `// Linear Regression — Pure JavaScript
class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
  }

  fit(xArr, yArr) {
    const n = xArr.length;
    const sumX  = xArr.reduce((a, x) => a + x, 0);
    const sumY  = yArr.reduce((a, y) => a + y, 0);
    const sumXY = xArr.reduce((a, x, i) => a + x * yArr[i], 0);
    const sumX2 = xArr.reduce((a, x) => a + x * x, 0);

    // Closed-form (Normal Equation)
    this.slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    this.intercept = (sumY - this.slope * sumX) / n;

    return this;
  }

  predict(x) {
    return this.slope * x + this.intercept;
  }

  score(xArr, yArr) {
    const meanY = yArr.reduce((a, y) => a + y, 0) / yArr.length;
    const ssTotal = yArr.reduce((a, y) => a + (y - meanY) ** 2, 0);
    const ssRes = xArr.reduce((a, x, i) => {
      return a + (yArr[i] - this.predict(x)) ** 2;
    }, 0);
    return 1 - ssRes / ssTotal;  // R²
  }
}

// Demo: study hours → exam score
const hours  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const scores = [45, 50, 55, 62, 68, 73, 78, 85, 89, 95];

const model = new LinearRegression();
model.fit(hours, scores);

console.log(\`Formula: score = \${model.slope.toFixed(2)} × hours + \${model.intercept.toFixed(2)}\`);
console.log(\`R² Score: \${model.score(hours, scores).toFixed(4)}\`);
console.log(\`Predict 5.5 hours: \${model.predict(5.5).toFixed(1)}\`);
console.log(\`Predict 12 hours:  \${model.predict(12).toFixed(1)}\`);`,
    explanation: [
      'Uses the closed-form Normal Equation — no iterative training needed for simple LR',
      'slope = (n·Σxy - Σx·Σy) / (n·Σx² - (Σx)²) — the classic formula',
      'intercept = (Σy - slope·Σx) / n — where the line crosses the y-axis',
      'R² (coefficient of determination) measures goodness of fit: 1.0 = perfect',
      'This approach works great for small datasets and single-variable regression',
    ],
  },
  {
    id: 'js-gradient',
    title: 'Gradient Descent in JavaScript',
    description: 'Iterative optimization from scratch — watch the loss decrease step by step.',
    difficulty: 'intermediate',
    language: 'JavaScript',
    tags: ['gradient descent', 'optimization', 'from scratch'],
    code: `// Gradient Descent Linear Regression — JavaScript
function linearRegressionGD(X, y, learningRate = 0.01, epochs = 500) {
  let w = 0;
  let b = 0;
  const n = X.length;
  const history = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Forward: predictions
    const predictions = X.map(x => w * x + b);

    // Loss: MSE
    const loss = predictions.reduce((sum, pred, i) => {
      return sum + (y[i] - pred) ** 2;
    }, 0) / n;

    // Gradients
    let dw = 0, db = 0;
    for (let i = 0; i < n; i++) {
      const error = predictions[i] - y[i];
      dw += (2 / n) * error * X[i];
      db += (2 / n) * error;
    }

    // Update
    w -= learningRate * dw;
    b -= learningRate * db;

    if (epoch % 100 === 0) {
      history.push({ epoch, loss: loss.toFixed(4), w: w.toFixed(4), b: b.toFixed(4) });
    }
  }

  return { w, b, history };
}

// Demo
const X = [1, 2, 3, 4, 5, 6, 7, 8];
const y = [2.1, 4.0, 5.8, 8.1, 10.2, 11.9, 14.1, 15.8]; // ~2x + 0

const { w, b, history } = linearRegressionGD(X, y, 0.01, 1000);

console.log("Training Progress:");
console.table(history);
console.log(\`\\nFinal: ŷ = \${w.toFixed(3)}·x + \${b.toFixed(3)}\`);
console.log(\`Predict x=10: \${(w * 10 + b).toFixed(2)}\`);`,
    explanation: [
      'Start with random (or zero) weights and iteratively improve them',
      'Each epoch: predict → compute loss → compute gradients → update weights',
      'dw and db are partial derivatives of MSE with respect to w and b',
      'Update rule: w -= lr * dw moves weights in the direction that reduces loss',
      'The history array lets you visualize how loss decreases over training',
      'Learning rate (0.01) controls step size — experiment with different values!',
    ],
  },

  // ──────── TYPESCRIPT ────────
  {
    id: 'ts-typed',
    title: 'Type-Safe Regression in TypeScript',
    description: 'Fully typed linear regression with generics and interfaces — production-ready.',
    difficulty: 'intermediate',
    language: 'TypeScript',
    tags: ['TypeScript', 'type-safe', 'production'],
    code: `// Type-safe Linear Regression — TypeScript

interface RegressionResult {
  weights: number[];
  bias: number;
  r2: number;
  predictions: number[];
}

interface TrainOptions {
  learningRate?: number;
  epochs?: number;
  logEvery?: number;
}

function linearRegression(
  X: number[][],           // shape: [n_samples, n_features]
  y: number[],             // shape: [n_samples]
  options: TrainOptions = {}
): RegressionResult {
  const { learningRate = 0.01, epochs = 1000, logEvery = 200 } = options;
  const n = X.length;
  const nFeatures = X[0].length;

  // Initialize
  const weights = new Array(nFeatures).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Forward pass
    const predictions = X.map(row =>
      row.reduce((sum, x, j) => sum + x * weights[j], 0) + bias
    );

    // Compute gradients
    const dw = new Array(nFeatures).fill(0);
    let db = 0;

    for (let i = 0; i < n; i++) {
      const error = predictions[i] - y[i];
      for (let j = 0; j < nFeatures; j++) {
        dw[j] += (2 / n) * error * X[i][j];
      }
      db += (2 / n) * error;
    }

    // Update
    for (let j = 0; j < nFeatures; j++) {
      weights[j] -= learningRate * dw[j];
    }
    bias -= learningRate * db;

    if (epoch % logEvery === 0) {
      const loss = predictions.reduce((s, p, i) => s + (y[i] - p) ** 2, 0) / n;
      console.log(\`Epoch \${epoch}: loss = \${loss.toFixed(4)}\`);
    }
  }

  // Final predictions & R²
  const finalPred = X.map(row =>
    row.reduce((sum, x, j) => sum + x * weights[j], 0) + bias
  );
  const meanY = y.reduce((a, v) => a + v, 0) / n;
  const ssTotal = y.reduce((a, v) => a + (v - meanY) ** 2, 0);
  const ssRes = finalPred.reduce((a, p, i) => a + (y[i] - p) ** 2, 0);

  return {
    weights,
    bias,
    r2: 1 - ssRes / ssTotal,
    predictions: finalPred,
  };
}

// Usage
const X: number[][] = [
  [1500, 3, 10],  // [size, bedrooms, age]
  [2000, 4, 5],
  [800,  2, 20],
  [1200, 2, 15],
  [3000, 5, 2],
];
const y = [300000, 450000, 180000, 240000, 650000];

const result = linearRegression(X, y, {
  learningRate: 0.0000001,  // small lr because features are large
  epochs: 5000,
});

console.log("Weights:", result.weights.map(w => w.toFixed(2)));
console.log("Bias:", result.bias.toFixed(2));
console.log("R²:", result.r2.toFixed(4));`,
    explanation: [
      'RegressionResult interface ensures the output shape is always predictable',
      'TrainOptions with optional fields and defaults make the API flexible yet safe',
      'number[][] for X supports any number of features — true multivariate regression',
      'Type safety catches bugs at compile time: wrong array shapes, missing fields, etc.',
      'For large feature values, use a very small learning rate or normalize features first',
    ],
  },

  // ──────── PRACTICAL ────────
  {
    id: 'py-real-world',
    title: 'Real-World Pipeline: Predict → Deploy',
    description: 'End-to-end: load CSV, clean data, train, evaluate, save model for production.',
    difficulty: 'advanced',
    language: 'Python',
    tags: ['pipeline', 'production', 'joblib'],
    code: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.pipeline import Pipeline
import joblib

# ──── 1. Load & Clean Data ────
# Simulating a CSV-like dataset
np.random.seed(42)
n = 500
df = pd.DataFrame({
    'sqft':     np.random.randint(400, 4000, n),
    'bedrooms': np.random.randint(1, 7, n),
    'bathrooms': np.random.randint(1, 4, n),
    'year_built': np.random.randint(1960, 2024, n),
    'garage':   np.random.choice([0, 1, 2], n),
    'price':    None  # will compute below
})
df['price'] = (
    120 * df['sqft'] +
    15000 * df['bedrooms'] +
    20000 * df['bathrooms'] -
    500 * (2024 - df['year_built']) +
    25000 * df['garage'] +
    80000 +
    np.random.randn(n) * 25000
).astype(int)

print("Dataset shape:", df.shape)
print(df.describe().round(0))

# ──── 2. Feature Engineering ────
features = ['sqft', 'bedrooms', 'bathrooms', 'year_built', 'garage']
X = df[features]
y = df['price']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ──── 3. Build Pipeline ────
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LinearRegression()),
])

pipeline.fit(X_train, y_train)

# ──── 4. Evaluate ────
y_pred = pipeline.predict(X_test)
print(f"\\n📊 Results:")
print(f"  MAE:  \${mean_absolute_error(y_test, y_pred):,.0f}")
print(f"  R²:   {r2_score(y_test, y_pred):.4f}")

# ──── 5. Save for Production ────
joblib.dump(pipeline, 'house_price_model.pkl')
print("\\n✅ Model saved to house_price_model.pkl")

# ──── 6. Load & Predict (simulate production) ────
loaded = joblib.load('house_price_model.pkl')
new_house = pd.DataFrame([{
    'sqft': 1800, 'bedrooms': 3,
    'bathrooms': 2, 'year_built': 2015, 'garage': 1
}])
prediction = loaded.predict(new_house)[0]
print(f"\\n🏠 New house prediction: \${prediction:,.0f}")`,
    explanation: [
      'Pipeline bundles preprocessing (scaling) and model into one serializable object',
      'StandardScaler inside pipeline ensures test data is scaled with train statistics',
      'joblib.dump() saves the entire pipeline — scaler parameters + model weights',
      'In production, just load the .pkl file and call predict() — no retraining needed',
      'Always evaluate on held-out test data to estimate real-world performance',
      'MAE in dollars is directly interpretable: "predictions are ~$X off on average"',
    ],
  },
];

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', dot: 'bg-success' },
  intermediate: { label: 'Intermediate', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', dot: 'bg-warning' },
  advanced: { label: 'Advanced', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', dot: 'bg-error' },
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-light/80 rounded-t-xl border-b border-border/50">
        <span className="text-xs text-foreground/40 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md text-foreground/40 hover:text-foreground/80 hover:bg-surface transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 bg-[#0d1117] rounded-b-xl text-sm leading-relaxed">
        <code className="text-foreground/80 font-mono text-xs">{code}</code>
      </pre>
    </div>
  );
}

function ExampleCard({ example }: { example: CodeExample }) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[example.difficulty];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 hover:bg-surface-light/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 shrink-0">{languageIcons[example.language]}</span>
              <h3 className="text-base font-bold text-foreground truncate">{example.title}</h3>
            </div>
            <p className="text-sm text-foreground/50 line-clamp-2">{example.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${diff.bg} ${diff.border} ${diff.color}`}>
                {diff.label}
              </span>
              {example.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-light text-foreground/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-foreground/30" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <CodeBlock code={example.code} language={example.language} />

              {/* Explanation */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-primary-light mb-3 flex items-center gap-2">
                  <span>💡</span> Key Concepts
                </h4>
                <ul className="space-y-2">
                  {example.explanation.map((point, i) => (
                    <li key={i} className="flex gap-2 text-xs text-foreground/60">
                      <span className="text-primary/40 mt-0.5 shrink-0">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ExamplesPage() {
  const [filter, setFilter] = useState<'all' | 'Python' | 'JavaScript' | 'TypeScript'>('all');
  const [diffFilter, setDiffFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filtered = examples.filter(e => {
    if (filter !== 'all' && e.language !== filter) return false;
    if (diffFilter !== 'all' && e.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Code Examples</h1>
          </div>
          <p className="text-foreground/50 mb-6">
            Copy-paste ready implementations of Linear Regression — from beginner-friendly to production-grade.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
            {(['all', 'Python', 'JavaScript', 'TypeScript'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === lang
                    ? 'bg-primary/20 text-primary-light font-bold'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {lang === 'all' ? 'All Languages' : lang}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  diffFilter === d
                    ? 'bg-primary/20 text-primary-light font-bold'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Examples list */}
        <div className="space-y-4">
          {filtered.map((example, i) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <ExampleCard example={example} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground/30 text-lg">No examples match your filters.</p>
            <button
              onClick={() => { setFilter('all'); setDiffFilter('all'); }}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Bottom tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 glass rounded-xl p-5 text-center"
        >
          <p className="text-sm text-foreground/40">
            💡 All examples are self-contained. Copy the code, paste into your editor, and run!
          </p>
          <p className="text-xs text-foreground/25 mt-1">
            Python examples need <code className="text-primary/60">pip install numpy scikit-learn pandas</code> — JS/TS examples have zero dependencies.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert LinearMind AI for Linear Regression and Machine Learning. You help students understand:
- Linear Regression (y = wx + b)
- Cost functions (MSE)
- Gradient Descent optimization
- Training process (epochs, convergence)
- Failure cases (outliers, nonlinear, overfitting, underfitting)
- Comparison with other methods

Rules:
- Keep explanations clear and concise
- Use analogies and examples
- When asked math, show step-by-step
- Be encouraging and supportive
- Use emojis sparingly for engagement
- If asked about unrelated topics, gently redirect to Linear Regression
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, explainLevel } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('GEMINI_API_KEY loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
    if (!apiKey) {
      return NextResponse.json(
        { message: 'AI API key not configured. Please set GEMINI_API_KEY in your .env.local file.' },
        { status: 200 }
      );
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (explainLevel) {
      const levelPrompts: Record<string, string> = {
        Beginner: 'Explain concepts simply, avoid jargon, use everyday analogies.',
        Engineer: 'Be precise, use technical terminology, include mathematical notation.',
        Child: 'Explain like talking to a 10-year-old. Use fun analogies, simple words, and emojis.',
        'Math-heavy': 'Focus on mathematical rigor. Show derivations, formulas, and proofs.',
      };
      systemPrompt += `\n\nExplanation style: ${levelPrompts[explainLevel] || ''}`;
    }

    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      const errorData = JSON.parse(error).error || {};
      const msg = errorData.status === 'RESOURCE_EXHAUSTED'
        ? 'API quota exceeded. The free tier limit has been reached — please wait a bit or upgrade your plan at aistudio.google.com.'
        : 'AI service temporarily unavailable. Try again later.';
      return NextResponse.json(
        { message: msg },
        { status: 200 }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response. Please try again.';

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

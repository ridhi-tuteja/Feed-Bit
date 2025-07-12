import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const { stream: asyncGenerator } = result;

    const readableStream = new ReadableStream({
      async start(controller) {
        //const textDecoder = new TextDecoder();
        for await (const chunk of asyncGenerator) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    const fallbackText = "What's a simple thing that makes you happy?||What's a fun fact about yourself?||What's a song you can't stop listening to?";
    return new NextResponse(fallbackText, { status: 200 });
  }
}
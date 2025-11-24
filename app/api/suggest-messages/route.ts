import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { aiRatelimit, checkRateLimit } from '@/lib/ratelimit';

// Create an OpenAI provider instance pointing to OpenRouter
const openai = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Rate limiting check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
    const { success: rateLimitSuccess } = await checkRateLimit(aiRatelimit, ip);

    if (!rateLimitSuccess) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { postContent, userDraft } = await req.json();

    // Build the prompt based on what content is available
    let userPrompt = "";
    if (postContent && userDraft) {
      userPrompt = `User wrote a post: "${postContent}"\nThey are currently typing this reply: "${userDraft}"\nMake suggestions that continue or complete their thought.`;
    } else if (postContent) {
      userPrompt = `User wrote a post: "${postContent}"\nGenerate 3 thoughtful reply suggestions.`;
    } else {
      userPrompt = "Generate 3 friendly, encouraging reply suggestions.";
    }



    const { text } = await generateText({
      model: openai('meituan/longcat-flash-chat:free'),
      system: "You generate concise, friendly reply suggestions for an anonymous conversation app. " +
        "Each suggestion must be a complete message. " +
        "Keep tone encouraging, kind, and natural. " +
        "Avoid emojis unless the context calls for them. " +
        "Never repeat the user's post. " +
        "Output exactly 3 suggestions separated by `||` with no numbering or labels.",
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.9,

    });



    return NextResponse.json({ suggestions: text });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}

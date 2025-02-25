import { NextRequest, NextResponse } from 'next/server';
import { EngineResponse, OpenAIAgent, QueryEngineTool } from 'llamaindex';
import { LlamaIndexAdapter } from 'ai';
import { FGARetriever } from 'auth0-ai-js/packages/ai-llamaindex/src';
import { initializeDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = req.nextUrl.searchParams.get('user');

    // Get the last user message
    const messages = body.messages ?? [];
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('Invalid message format');
    }

    // Load documents from the index
    const index = await initializeDB();
    // Create a retriever that uses FGA to gate fetching documents on permissions.
    const retriever = FGARetriever.create({
      // Set the similarityTopK to retrieve more documents as SimpleDirectoryReader creates chunks
      retriever: index.asRetriever({ similarityTopK: 30 }),
      // FGA tuple to query for the user's permissions
      buildQuery: (document: any) => ({
        user: `user:${user}`,
        object: `${document.metadata.file_name.split('.')[0]}`,
        relation: 'can_read',
      }),
    });

    // Create a query engine and convert it into a tool
    const queryEngine = index.asQueryEngine({ retriever });
    const tools = [
      new QueryEngineTool({
        queryEngine,
        metadata: {
          name: 'knowledge-base',
          description: `This tool can answer detailed questions about the company's HR policies and employees.`,
        },
      }),
    ];
    // Create an agent using the tools array and OpenAI GPT-4 LLM
    const agent = new OpenAIAgent({
      tools,
      systemPrompt: `You are a helpful HR assistant that can answer questions and help with tasks. You have access to a knowledge base tool that you can use to find relevant information. You are currently talking to ${user}.`,
    });
    // Query the agent
    const stream = await agent.chat({ message: lastMessage.content, stream: true, chatHistory: messages });

    return LlamaIndexAdapter.toDataStreamResponse(stream as unknown as AsyncIterable<EngineResponse>);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}

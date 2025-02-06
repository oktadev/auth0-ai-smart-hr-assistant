import {
  OpenAIAgent,
  QueryEngineTool,
  SimpleDirectoryReader,
  VectorStoreIndex,
} from "llamaindex";
import "dotenv/config";
import path from "path";
import { FGARetriever } from "./fga-retriever";
import { User } from "./users";

export class LlmAgent {
  private user: User;
  private agent: OpenAIAgent | null = null;

  constructor(user: User) {
    this.user = user;
  }

  setUser(user: User) {
    this.user = user;
  }

  async initialize() {
    try {
      // Load documents from the documents directory
      const documentsPath = path.join(process.cwd(), "documents");
      const reader = new SimpleDirectoryReader();
      const documents = await reader.loadData(documentsPath);
      // Create index
      const index = await VectorStoreIndex.fromDocuments(documents, {});
      // Create a retriever that uses FGA to gate fetching documents on permissions.
      const retriever = FGARetriever.create({
        // Set the similarityTopK to retrieve more documents as SimpleDirectoryReader creates chunks
        retriever: index.asRetriever({ similarityTopK: 30 }),
        // FGA tuple to query for the user's permissions
        buildQuery: (document) => ({
          user: `user:${this.user.name}`,
          object: `employee_information:${
            document.metadata.file_name.split(".")[0]
          }`,
          relation: "can_read",
        }),
      });

      // Create a query engine and convert it into a tool
      const queryEngine = index.asQueryEngine({ retriever });
      const tools = [
        new QueryEngineTool({
          queryEngine,
          metadata: {
            name: "smart-hr-assistant",
            description: `This tool can answer detailed questions about the company's HR policies and employees.`,
          },
        }),
      ];

      // Create an agent using the tools array and OpenAI GPT-4 LLM
      this.agent = new OpenAIAgent({
        tools,
        systemPrompt: `You are a helpful HR assistant. ${this.user.name} is the user you are talking to.`,
      });
    } catch (error) {
      console.error("Error initializing Ai Agent:", error);
      throw error;
    }
  }

  async getResponse(message: string): Promise<string> {
    try {
      if (!this.agent) {
        throw new Error("LLM agent not initialized");
      }

      // Query the agent
      const response = await this.agent.chat({ message });

      return response.message.content.toString();
    } catch (error) {
      console.error("Error getting response:", error);
      return "I apologize, but I'm having trouble processing your request. Please try again or contact HR directly.";
    }
  }
}

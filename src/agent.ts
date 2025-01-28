import {
  Document,
  OpenAIAgent,
  QueryEngineTool,
  SimpleDirectoryReader,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
import "dotenv/config";
import path from "path";

// Sample HR policies and information
const hrPolicies = `
Company HR Policies Overview:

1. Leave Policy:
- 20 days annual leave
- 10 days sick leave
- Parental leave as per local regulations
- Leave requests must be submitted 2 weeks in advance

2. Work Hours:
- Standard work hours: 9 AM to 5 PM
- Flexible timing available with manager approval
- Core hours: 10 AM to 4 PM

3. Remote Work:
- Hybrid work model (3 days office, 2 days remote)
- Must maintain regular communication
- Need stable internet connection

4. Benefits:
- Health insurance
- 401(k) matching
- Professional development budget
- Annual wellness allowance

5. Code of Conduct:
- Professional behavior expected
- Zero tolerance for harassment
- Confidentiality of company information
- Dress code: Business casual

For specific queries, contact HR@company.com
`;

export class LlmAgent {
  private username: string;
  private agent: OpenAIAgent | null = null;

  constructor(username: string) {
    this.username = username;
  }

  setUsername(username: string) {
    this.username = username;
  }

  async initialize() {
    try {
      // Load documents from the documents directory
      const documentsPath = path.join(process.cwd(), "documents");
      const reader = new SimpleDirectoryReader();
      const documents = await reader.loadData(documentsPath);

      // Add the default HR policies as a document
      documents.push(new Document({ text: hrPolicies }));

      // Create index
      const index = await VectorStoreIndex.fromDocuments(documents, {});

      // Create query engine
      const queryEngine = index.asQueryEngine();
      const tools = [
        new QueryEngineTool({
          queryEngine,
          metadata: {
            name: "smart-hr-assistant",
            description: `This tool can answer detailed questions about the company's HR policies.`,
          },
        }),
      ];

      // Create an agent using the tools array and OpenAI GPT-4 LLM
      this.agent = new OpenAIAgent({ tools });
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

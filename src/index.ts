#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import { marked } from "marked";
//@ts-ignore
import TerminalRenderer from "marked-terminal";
import { LlmAgent } from "./agent";
import chalk from "chalk";
import { User, AVAILABLE_USERS, UserQuestion } from "./users";

interface ChatQuestion {
  question: string;
}

async function promptUsername(): Promise<User> {
  const { value } = await inquirer.prompt<UserQuestion>([
    {
      type: "list",
      name: "value",
      message: "Please select a user:",
      choices: AVAILABLE_USERS,
    },
  ]);

  return value;
}

async function startChat(user: User) {
  console.log(
    chalk.green(
      `\nWelcome ${chalk.bold(user.displayName)}! 
      👋 I'm your HR Assistant powered by AI.
      Ask me anything about HR policies, Company policies, team documents, or employee information.
      Enter '/switchuser' to switch to a different user and '/bye' to exit.`
    )
  );

  // Initialize LLM service
  const llmAgent = new LlmAgent(user);
  try {
    console.log(
      chalk.yellow("\nInitializing AI service...\nLoading documents...")
    );
    await llmAgent.initialize();
    console.log(chalk.green("AI service ready! 🚀\n"));
  } catch (error) {
    console.error(chalk.red("Failed to initialize AI service:"), error);
    console.log(chalk.yellow("Falling back to basic response mode...\n"));
  }

  // set markdown rendering options
  marked.setOptions({ renderer: new TerminalRenderer() });

  while (true) {
    const { question } = await inquirer.prompt<ChatQuestion>([
      {
        type: "input",
        name: "question",
        message: "🤔 What would you like to know?",
        validate: (input: string) =>
          input.length > 0 || "Please enter a question",
      },
    ]);

    // Check for commands first
    if (question.toLowerCase() === "/switchuser") {
      const newUserSession = await promptUsername();
      console.log(
        chalk.cyan(`\n👋 Switching user to: ${newUserSession.displayName}`)
      );
      user = newUserSession;
      llmAgent.setUser(user);
      console.log(
        chalk.green(
          `\nWelcome ${chalk.bold(user.name)} (${chalk.italic(
            user.role
          )})! 👋 I'm your HR Assistant powered by AI. Ask me anything about HR policies, Company policies, or employee information.\n`
        )
      );
      continue;
    }

    if (
      question.toLowerCase().includes("/bye") ||
      question.toLowerCase().includes("/exit")
    ) {
      console.log(chalk.cyan("\n🤖 Assistant: Goodbye! Have a great day! 👋"));
      process.exit(0);
    }

    try {
      // Get response from LLM
      console.log(chalk.cyan("\n🤖 Assistant:"));
      const response = await llmAgent.getResponse(question);

      // Format and print the response
      const formattedResponse = marked.parse(response);
      console.log(formattedResponse);
    } catch (error) {
      // Fallback responses if LLM fails
      console.log(chalk.red("\n🤖 Assistant:"));
      console.log(
        chalk.red(
          `There is an error. The AI is not able to answer your question. Please contact HR@company.com`
        )
      );
      console.log(error);
    }

    console.log(); // Empty line for better readability
  }
}

const program = new Command();

// Set up CLI metadata
program
  .name("smart-hr")
  .description("Interactive HR Assistant Chatbot powered by AI")
  .version("1.0.0")
  .action(async () => {
    const userSession = await promptUsername();
    await startChat(userSession);
  });

program.parse();

# SmartHR Assistant - AI Agent with Fine-Grained Authorization

A sample application demonstrating how to implement an AI agent with fine-grained authorization controls when accessing sensitive user data.

## Overview

SmartHR Assistant is an intelligent document management system that:

1. Provides secure access to HR documents based on complex authorization rules:

   - Salary information (viewable only by HR and the specific employee)
   - Performance reviews (viewable by employee, their manager, and HR)
   - Employee information (viewable by HR and the specific employee)
   - Team documents (viewable by team members only)
   - Company policies (public to all employees)

2. Offers AI-powered capabilities:
   - Answers questions about policies and procedures
   - Generates document summaries
   - Assists with document search

## Data Categories with Different Authorization Levels

### 1. Employee Information

- Salary information
- Performance reviews
- Employee personal and public information

### 2. Team Information

- Team documents
- Team members

### 3. Company Information

- Company policies
- Company documents

## Authorization Levels

### 1. Employee Level

- Full access to their own records
- Limited access to other employees' public information
- Full access to public company documents
- Full access to their teams documents

### 2. Manager Level

Employee Level +

- Full access to their team members information
- Full access to performance reviews of their team

### 3. HR Level

Manager Level +

- Full access to all employee information
- Full access to all team information
- Full access to all performance reviews

### 4. Admin Level

- Full access to all data

## Future Enhancements

- Convert to Express App and add a Chat UI for the application
- Integrate Auth0 and get the user information from Auth0
- Add tool calling agent
- Add SQL DB for realtime data
- Add Async auth example

## How to run

### Prerequisites

- An Okta FGA account, you can create one [here](https://dashboard.fga.dev).
- An OpenAI account and API key create one [here](https://platform.openai.com).

### Setup

1. Install the dependencies

```sh
bun install # or npm install
```

2. Create a `.env.local` file using the format below:

   ```sh
    # OpenAI
    OPENAI_API_KEY=xx-xxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxx

    # Okta FGA
    FGA_STORE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxx
    FGA_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxx
    FGA_CLIENT_SECRET=xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxx
    # Required only for non-US regions
    FGA_API_URL=https://api.xxx.fga.dev
    FGA_API_AUDIENCE=https://api.xxx.fga.dev/
   ```

### Obtain OpenAI API Key

[Use this page for instructions on how to find your OpenAI API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key). Once you have your key, update the `.env` file accordingly.

### Configure Okta FGA

1. **Create a client**

   Navigate to _Settings_ and in the _Authorized Clients_ section click **+ Create Client** button. On the new page give your client a name and mark all three client permissions then click **Create**.

2. Copy the information on the modal and update your `.env` file with the values you now have for `FGA_STORE_ID`, `FGA_CLIENT_ID`, and `FGA_CLIENT_SECRET`.
3. Run the `npm run fga-init` script to initialize the FGA store with the model and tuples.

### Run the application

```sh
bun start # or npm start
```

## Technical Stack

This application is built with TypeScript, Next.js, TailwindCSS, LlamaIndex, and OpenFGA.

## Data Sources

All data will be in PDF and markdown files and will be loaded into an in-memory vector store on application startup.

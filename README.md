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

## Technical Stack

This application is built with TypeScript, Node.js, LlamaIndex, and OpenFGA.

## Data Sources

All data will be in PDF and markdown files and will be loaded into an in-memory vector store on application startup.

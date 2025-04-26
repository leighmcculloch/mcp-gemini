#!/usr/bin/env -S deno run --allow-env

import { Server } from "npm:@modelcontextprotocol/sdk@1.8.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.8.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "npm:@modelcontextprotocol/sdk@1.8.0/types.js";

import { GoogleGenAI } from "npm:@google/genai@0.10.0";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is required");
  Deno.exit(1);
}

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = ai.chats.create({
  model: "gemini-2.5-pro-preview-03-25",
  history: [
    { role: "user", parts: [{ text: "Hello, I'm a senior software engineer." }], },
    { role: "model", parts: [{ text: "Great to meet you. What would you like to do?" }], },
  ],
});

const server = new Server(
  {
    name: "mcp-gemini",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "chat",
        description: "Chat to Gemini.",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message to send to Gemini."
            },
          },
          required: ["message"]
        }
      },
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "chat": {
      const message = String(request.params.arguments?.message);
      if (!message) {
        throw new Error("Message is required");
      }

      // Generate response
      const result = await chat.sendMessage({ message });

      return {
        content: [{
          type: "text",
          text: result.text,
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  Deno.exit(1);
});

const { OpenAIClient } = require("@azure/openai");
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const { DefaultAzureCredential } = require("@azure/identity");

// Initialize Azure OpenAI client
let openaiClient;
let searchClient;

// Initialize clients on first request
async function initializeClients() {
  if (openaiClient && searchClient) {
    return;
  }

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const key = process.env.AZURE_OPENAI_KEY;
  const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;
  
  const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const searchKey = process.env.AZURE_SEARCH_KEY;
  const searchIndex = process.env.AZURE_SEARCH_INDEX;

  if (!endpoint || !key || !deploymentId) {
    throw new Error("Azure OpenAI environment variables not configured");
  }

  if (!searchEndpoint || !searchKey || !searchIndex) {
    throw new Error("Azure Search environment variables not configured");
  }

  // Initialize OpenAI client
  openaiClient = new OpenAIClient(endpoint, new AzureKeyCredential(key));
  
  // Initialize Search client
  searchClient = new SearchClient(
    searchEndpoint,
    searchIndex,
    new AzureKeyCredential(searchKey)
  );
}

/**
 * Search for relevant documents using Azure Search
 */
async function searchDocuments(query, topK = 3) {
  try {
    const results = await searchClient.search(query, {
      top: topK,
      includeTotalCount: true,
      select: ["id", "content", "source", "title"]
    });

    const documents = [];
    for await (const result of results) {
      documents.push({
        id: result.document.id,
        content: result.document.content || "",
        source: result.document.source || "",
        title: result.document.title || ""
      });
    }
    return documents;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Main chat function
 */
module.exports = async function (context, req) {
  context.log("Chat function processing request");

  try {
    // Initialize clients
    await initializeClients();

    // Validate request
    if (!req.body || typeof req.body.message !== "string") {
      context.res = {
        status: 400,
        body: { error: "Message is required in request body" },
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      };
      return;
    }

    const userMessage = req.body.message;
    const conversationHistory = req.body.history || [];

    // Step 1: Search for relevant documents
    const searchResults = await searchDocuments(userMessage);
    
    // Step 2: Build context from search results
    let context_text = "";
    if (searchResults.length > 0) {
      context_text = "Relevant documents:\n\n";
      searchResults.forEach((doc, index) => {
        context_text += `[${index + 1}] ${doc.title || "Document " + (index + 1)}\n`;
        context_text += `Source: ${doc.source}\n`;
        context_text += `Content: ${doc.content.substring(0, 500)}...\n\n`;
      });
    }

    // Step 3: Build messages for OpenAI
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant. Use the following context to answer the user's question. 
        If you don't know the answer based on the context, say so honestly.

        ${context_text}`
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage
    });

    // Step 4: Get response from OpenAI
    const response = await openaiClient.getCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_ID,
      messages,
      {
        maxTokens: 1000,
        temperature: 0.7
      }
    );

    const assistantMessage = response.choices[0]?.message?.content || "I couldn't generate a response.";

    // Return response with citations
    context.res = {
      status: 200,
      body: {
        message: assistantMessage,
        sources: searchResults.map(doc => ({
          title: doc.title,
          source: doc.source
        }))
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };

  } catch (error) {
    context.log("Error:", error);
    context.res = {
      status: 500,
      body: { error: error.message },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};

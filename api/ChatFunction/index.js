// Commented out - will uncomment after testing basic function
// const { OpenAIClient } = require("@azure/openai");
// const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
// const { DefaultAzureCredential } = require("@azure/identity");

/**
 * Main chat function
 */
module.exports = async function (context, req) {
  context.log("Chat function processing request");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
    return;
  }

  try {
    // Simple test response
    context.res = {
      status: 200,
      body: {
        message: "Chatbot is working! Configure environment variables for full AI features.",
        sources: []
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

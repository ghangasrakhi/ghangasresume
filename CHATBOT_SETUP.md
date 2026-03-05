# Chatbot Implementation Guide

## Overview

This guide helps you set up and run the AI-powered chatbot in your website. The chatbot uses:
- **Backend**: Azure Functions (Node.js) for chat API
- **AI Engine**: Azure OpenAI (GPT models)
- **Search**: Azure AI Search for document retrieval
- **Frontend**: Self-contained JavaScript widget

## Architecture

```
┌─────────────────────────────────┐
│     Your Website (HTML/JS)      │
│  ┌───────────────────────────┐  │
│  │   Chatbot Widget (JS)     │  │◄─── Chat messages
│  └───────────────────────────┘  │
└─────────────┬───────────────────┘
              │ HTTP POST
              ▼
┌─────────────────────────────────────┐
│   Azure Function - Chat API         │
│  ┌──────────────────────────────┐   │
│  │ 1. Process user message      │   │
│  │ 2. Search documents (AI)     │   │
│  │ 3. Generate response (GPT)   │   │
│  └──────────────────────────────┘   │
└──┬──────────────────────────────┬───┘
   │                              │
   ▼                              ▼
┌──────────────────┐    ┌───────────────────┐
│ Azure AI Search  │    │ Azure OpenAI      │
│ (Vector DB)      │    │ (GPT-4 / GPT-3.5) │
└──────────────────┘    └───────────────────┘
```

## Prerequisites

### Azure Resources Needed
1. **Azure OpenAI Service** - with GPT-4 or GPT-3.5 deployment
2. **Azure AI Search** - with vector search enabled
3. **Azure Storage** - for storing documents
4. **Azure Functions** - for running the chat API

### Local Requirements
- Node.js 14+ for Azure Functions
- Azure CLI
- Azure Functions Core Tools

## Setup Instructions

### 1. Create Azure Resources

```bash
# Set variables
$resourceGroup = "my-chatbot-rg"
$location = "eastus"
$storageAccount = "mychatbotstorage"
$openaiName = "my-chatbot-openai"
$searchService = "my-chatbot-search"

# Create resource group
az group create --name $resourceGroup --location $location

# Create Azure OpenAI (replace with your endpoint/key)
az cognitiveservices account create \
  --name $openaiName \
  --resource-group $resourceGroup \
  --kind OpenAI \
  --sku s0 \
  --location $location

# Create Azure AI Search
az search service create \
  --name $searchService \
  --resource-group $resourceGroup \
  --location $location \
  --sku standard

# Create Storage Account
az storage account create \
  --name $storageAccount \
  --resource-group $resourceGroup \
  --location $location
```

### 2. Create Azure OpenAI Deployment

In Azure Portal:
1. Go to your Azure OpenAI resource
2. Click "Deployments" → "Create new deployment"
3. Select a currently supported model such as `gpt-4.1-mini` or `gpt-4o-mini`.
4. Give your deployment a clear name (e.g. `chat-model`, `gpt-4.1`).
5. Note the deployment name for later

### 3. Set Up Azure AI Search

In Azure Portal:
1. Go to your Azure AI Search resource
2. Click "Indexes" → "Create index"
3. Configure fields:
   - `id`: Edm.String (key)
   - `content`: Edm.String (searchable)
   - `title`: Edm.String
   - `source`: Edm.String
   - `vectors`: Collection(Edm.Single) (vectorizer enabled)

### 4. Get API Keys

```bash
# Get OpenAI endpoint and key
az cognitiveservices account show \
  --name $openaiName \
  --resource-group $resourceGroup \
  --query properties.endpoints.OpenAI

az cognitiveservices account keys list \
  --name $openaiName \
  --resource-group $resourceGroup

# Get Search endpoint and key
az search service show \
  --name $searchService \
  --resource-group $resourceGroup

az search admin-key show \
  --service-name $searchService \
  --resource-group $resourceGroup
```

### 5. Configure Environment Variables

Create `.env` file in `/api` folder:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_ID=gpt-35-turbo

# Azure Search Configuration
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_KEY=your-search-key-here
AZURE_SEARCH_INDEX=documents

# Optional
NODE_ENV=development
```

### 6. Install Dependencies

```bash
cd api
npm install
```

### 7. Deploy Azure Function

```bash
# Login to Azure
az login

# Create function app (if not exists)
az functionapp create \
  --resource-group $resourceGroup \
  --consumption-plan-location $location \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name my-chatbot-api

# Deploy
func azure functionapp publish my-chatbot-api

# Set environment variables in Azure
az functionapp config appsettings set \
  --name my-chatbot-api \
  --resource-group $resourceGroup \
  --settings \
  AZURE_OPENAI_ENDPOINT=your-endpoint \
  AZURE_OPENAI_KEY=your-key \
  AZURE_OPENAI_DEPLOYMENT_ID=<your-deployment-name> \
  AZURE_SEARCH_ENDPOINT=your-endpoint \
  AZURE_SEARCH_KEY=your-key \
  AZURE_SEARCH_INDEX=documents
```

## Using the Chatbot Widget

### Basic Integration

Add to your HTML page:

```html
<!-- Include chatbot widget -->
<script src="path/to/js/chatbot.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    ChatbotWidget.init({
      // (Required) Your API endpoint
      apiUrl: 'https://your-api.azurewebsites.net/api/chat',
      
      // (Optional) Widget position
      position: 'bottom-right', // or 'bottom-left', 'top-right', 'top-left'
      
      // (Optional) Widget title
      title: 'Chat Assistant',
      
      // (Optional) Input placeholder
      placeholder: 'Type your message...',
      
      // (Optional) Theme
      theme: 'light' // or 'dark'
    });
  });
</script>
```

### Advanced Usage

```javascript
// Open/Close programmatically
ChatbotWidget.open();
ChatbotWidget.close();

// Send message programmatically
ChatbotWidget.sendMessage('Hello, how are you?');

// Clear conversation
ChatbotWidget.clearChat();
```

### Data Attributes (Auto-initialization)

```html
<script 
  src="js/chatbot.js"
  data-api-url="https://your-api.azurewebsites.net/api/chat"
  data-position="bottom-right"
  data-title="Chat Assistant"
  data-theme="light">
</script>
```

## API Endpoint Reference

### POST `/api/chat`

Process a chat message and return response with sources.

**Request:**
```json
{
  "message": "What is the company policy?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there! How can I help?"
    }
  ]
}
```

**Response:**
```json
{
  "message": "The company policy...",
  "sources": [
    {
      "title": "Company Policy Document",
      "source": "policies/handbook.pdf"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

## Populating Documents in Azure Search

### Option 1: Upload via Azure Portal

1. Go to Azure AI Search
2. Click "Indexes" → Select your index
3. Click "Upload documents"
4. Select JSON files

### Option 2: Use Upload Script

Create `upload-docs.js`:

```javascript
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const key = process.env.AZURE_SEARCH_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX;

const documents = [
  {
    id: "1",
    title: "Company Benefits",
    content: "Our employees receive comprehensive health insurance...",
    source: "benefits.pdf"
  },
  // Add more documents
];

const client = new SearchClient(endpoint, indexName, new AzureKeyCredential(key));

async function uploadDocuments() {
  try {
    const result = await client.uploadDocuments(documents);
    console.log("Uploaded", result.length, "documents");
  } catch (error) {
    console.error("Upload error:", error);
  }
}

uploadDocuments();
```

## Testing

### Local Testing

```bash
# Terminal 1: Start functions
cd api
npm install
func start

# Terminal 2: Test API
curl -X POST http://localhost:7071/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Browser Testing

1. Open your website
2. Look for chat widget in bottom-right
3. Type a message and send
4. Verify response appears

## Troubleshooting

### ChatBot not appearing
- Check browser console for errors
- Verify API URL is correct
- Check that chatbot.js is loaded

### "API is not configured" error
- Update `apiUrl` in initialization script
- Verify Azure Function is deployed and running
- Check CORS settings

### Chat returns errors
- Verify environment variables on Azure Function
- Check Azure OpenAI deployment exists
- Verify Azure Search index has documents
- Check Azure OpenAI and Search API keys

### No search results
- Verify documents are uploaded to Azure Search
- Check index name matches `AZURE_SEARCH_INDEX`
- Verify vector embeddings are generated

## Security Considerations

### Current Setup (Development)
- API is anonymous (`authLevel: "anonymous"`)
- CORS allows all origins

### Production Setup
1. **Enable Authentication**
   - Use Azure AD / Entra ID
   - Implement API key validation

2. **Restrict CORS**
   ```javascript
   "Access-Control-Allow-Origin": "https://your-domain.com"
   ```

3. **Rate Limiting**
   - Implement rate limiting in Azure Function
   - Use Azure API Management

4. **Data Protection**
   - Enable Azure Disk Encryption
   - Use managed identities instead of keys
   - Rotate keys regularly

5. **Network Security**
   - Use Private Endpoints
   - Enable firewall rules
   - Deploy in VNet

## Performance Optimization

1. **Caching**
   - Cache frequently asked questions
   - Implement response caching

2. **Search Optimization**
   - Use vector search for semantic similarity
   - Implement result filtering

3. **Models**
   - Use GPT-3.5 for lower cost/latency
   - Use GPT-4 for complex reasoning

## Monitoring

### Application Insights Setup

```bash
az functionapp config appsettings set \
  --name my-chatbot-api \
  --resource-group $resourceGroup \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=your-key
```

### View Logs

```bash
# View function logs
func azure functionapp list-functions my-chatbot-api

# Stream logs
func azure functionapp logstream my-chatbot-api --build remote
```

## Next Steps

1. ✅ Deploy resources
2. ✅ Configure environment variables
3. ✅ Upload documents to Azure Search
4. ✅ Add widget to homepage
5. ✅ Test chatbot functionality
6. 🔄 Monitor performance and errors
7. 🔄 Collect user feedback
8. 🔄 Optimize documents and prompts

## Support & Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure AI Search Documentation](https://learn.microsoft.com/azure/search/)
- [Azure Functions Documentation](https://learn.microsoft.com/azure/azure-functions/)
- [RAG Pattern Guide](https://learn.microsoft.com/azure/ai-services/openai/concepts/use-your-data)

## License

This chatbot implementation is provided as-is for your website. Modify and customize as needed.

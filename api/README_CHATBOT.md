# Chatbot Implementation for Rakhi's Resume Website

A modern, AI-powered chatbot for your personal website that helps visitors learn about your experience, skills, and projects. Built with Azure OpenAI, Azure AI Search, and Node.js.

## Features

✨ **Smart Responses** - Uses RAG (Retrieval Augmented Generation) to answer questions based on your actual resume and profile data

📚 **Document Citations** - Every response includes citations to the source documents used

🎨 **Beautiful UI** - Self-contained widget with light/dark theme support

📱 **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile devices

🔐 **Secure** - Runs on Azure with encryption and secure API endpoints

🚀 **Easy Deployment** - One-click deployment to Azure Functions

💬 **Multi-turn Conversations** - Maintains conversation history for context-aware responses

## What's Included

```
ghangasresume/
├── api/
│   ├── ChatFunction/              # Azure Function for chat API
│   │   ├── function.json
│   │   └── index.js
│   ├── .env.example               # Environment variables template
│   ├── sample-documents.js        # Your resume data
│   ├── upload-docs.js            # Script to upload documents
│   └── package.json              # Dependencies
│
├── Frontend/
│   ├── js/
│   │   ├── chatbot.js            # Chat widget (ready to use!)
│   │   └── ...other scripts
│   ├── index.html                # Added chatbot widget
│   ├── about.html                # Added chatbot widget
│   ├── portfolio.html            # Added chatbot widget
│   └── blog.html                 # Added chatbot widget
│
├── CHATBOT_SETUP.md              # Detailed setup guide
├── CHATBOT_QUICK_START.md        # Quick 5-minute start
└── README.md                     # This file
```

## Quick Start (5 minutes)

### 1. Set Up Azure Resources
```bash
# Create resource group
az group create --name chatbot-rg --location eastus

# Create Azure OpenAI
az cognitiveservices account create \
  --name my-chatbot-openai \
  --resource-group chatbot-rg \
  --kind OpenAI --sku s0 --location eastus

# Create Azure Search
az search service create \
  --name my-chatbot-search \
  --resource-group chatbot-rg --location eastus --sku standard
```

### 2. Deploy Model
1. Go to Azure Portal → Your OpenAI resource
2. Click "Deployments" → "Create new deployment"
3. Select a supported model (e.g. "gpt-4.1-mini" or "gpt-4o-mini") → give it a name like "chat-model" → Create

### 3. Configure Environment
```bash
cd api
cp .env.example .env
# Edit .env with your Azure keys
```

### 4. Deploy Function
```bash
npm install
az functionapp create --resource-group chatbot-rg \
  --consumption-plan-location eastus --runtime node \
  --runtime-version 18 --functions-version 4 --name my-chatbot-api

func azure functionapp publish my-chatbot-api

# Set environment variables in Azure
az functionapp config appsettings set \
  --name my-chatbot-api --resource-group chatbot-rg \
  --settings AZURE_OPENAI_ENDPOINT=... AZURE_OPENAI_KEY=... ...
```

### 5. Update Website
Find these lines in `Frontend/*.html`:
```javascript
apiUrl: 'https://your-api.azurewebsites.net/api/chat',
```

Replace with your function app URL:
```javascript
apiUrl: 'https://my-chatbot-api.azurewebsites.net/api/chat',
```

### 6. Upload Documents
```bash
node upload-docs.js
```

### 7. Test!
Visit your website and click the chat widget (💬) in the bottom right.

## How It Works

```
User Question
    ↓
Chat Widget (Frontend/js/chatbot.js)
    ↓ HTTP POST
Azure Function (/api/ChatFunction)
    ↓
1. Azure Search (retrieves relevant documents)
2. Azure OpenAI (generates response)
    ↓
Response with Citations
    ↓
Chat Widget displays answer
```

### Example Flow

**User**: "What are your main cloud skills?"

**Chatbot**:
1. Searches for documents about cloud skills
2. Finds: "Core Technical Skills" document
3. Sends to GPT: "Based on this document, what are the cloud skills?"
4. Returns response with citation to source

## File Structure

### `/api/ChatFunction/index.js`
The main chat API that:
- Receives user messages
- Searches Azure Search for relevant documents
- Sends context + conversation history to Azure OpenAI
- Returns response with source citations

### `/Frontend/js/chatbot.js`
Self-contained chat widget with:
- Beautiful UI with animations
- Message history management
- Typing indicators
- Error handling
- Responsive mobile design
- Light/dark theme support

### Configuration

**Environment Variables** (in `/api/.env`):
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_ID=<your-deployment-name>  # e.g. chat-model
AZURE_SEARCH_ENDPOINT=https://your-service.search.windows.net
AZURE_SEARCH_KEY=your-search-key
AZURE_SEARCH_INDEX=documents
```

**Widget Options** (in HTML):
```javascript
ChatbotWidget.init({
  apiUrl: 'https://api.example.com/api/chat',
  position: 'bottom-right',      // or 'bottom-left', 'top-right', 'top-left'
  title: 'Chat Assistant',
  placeholder: 'Type your message...',
  theme: 'light'                 // or 'dark'
});
```

## API Reference

### POST `/api/chat`

**Request:**
```json
{
  "message": "What are your skills?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi!"}
  ]
}
```

**Response:**
```json
{
  "message": "DevOps Engineer with skills in...",
  "sources": [
    {"title": "Core Technical Skills", "source": "skills.md"}
  ]
}
```

## Customization

### Change Chat Widget Appearance

Edit `Frontend/js/chatbot.js` styles section:

```javascript
// Change colors
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  // Accent color

// Change widget size
width: 380px;
height: 600px;
```

### Add More Documents

Edit `/api/sample-documents.js` and add your documents:

```javascript
{
  id: "9",
  title: "Your Document Title",
  content: "Your document content here...",
  source: "document.md",
  category: "general"
}
```

Then run:
```bash
node upload-docs.js
```

### Custom System Prompt

Edit `ChatFunction/index.js` - look for the system message:

```javascript
const messages = [
  {
    role: "system",
    content: `You are a helpful assistant...`
  }
];
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget not showing | Check API URL in HTML files matches deployed function |
| "API error" on chat | Verify Azure Function is deployed and environment vars are set |
| Search returns no results | Run `node upload-docs.js` to upload documents to index |
| CORS errors | Check `Access-Control-Allow-Origin` headers in ChatFunction/index.js |
| Rate limiting | Azure OpenAI has usage limits - monitor in Application Insights |

See `CHATBOT_SETUP.md` for detailed troubleshooting.

## Deployment Checklist

- [ ] Create Azure resource group
- [ ] Deploy Azure OpenAI with GPT model
- [ ] Deploy Azure AI Search
- [ ] Create search index with sample data
- [ ] Configure `.env` with API keys
- [ ] Deploy Azure Function
- [ ] Set environment variables in Azure Function App
- [ ] Update API URL in HTML files
- [ ] Upload documents with `node upload-docs.js`
- [ ] Test chatbot on your website
- [ ] Monitor logs and errors
- [ ] [Optional] Set up authentication
- [ ] [Optional] Configure custom domain

## Performance Tips

1. **Model Selection**
   - Use a cost‑efficient deployed model such as `gpt-4.1-mini` for production
   - Use `gpt-4` for complex reasoning

2. **Search Optimization**
   - Chunk documents into smaller pieces
   - Use meaningful titles and descriptions
   - Tag documents with categories

3. **Caching**
   - Cache frequently asked questions
   - Implement response caching in function

4. **Cost Optimization**
   - Monitor token usage
   - Implement rate limiting
   - Use search results limits

## Security Considerations

### Current Setup (Development)
- ✅ HTTPS (Azure Function provides)
- ❌ No authentication (anonymous access)
- ❌ CORS open to all domains

### Production Setup
1. **Enable Authentication**
   ```javascript
   // Add in ChatFunction/index.js
   const authenticated = checkAuthToken(req);
   ```

2. **Restrict CORS**
   ```javascript
   "Access-Control-Allow-Origin": "https://your-domain.com"
   ```

3. **Rate Limiting**
   ```javascript
   // Implement rate limiting per IP
   ```

4. **Secure Secrets**
   ```bash
   # Use Azure Key Vault instead of appsettings
   az keyvault secret set --vault-name my-vault --name openai-key --value ...
   ```

See `CHATBOT_SETUP.md` → Security section for production setup.

## Monitoring

### View Logs
```bash
func azure functionapp logstream my-chatbot-api
```

### Monitor Costs
Azure Portal → Function App → Metrics

### Application Insights
View detailed telemetry in Azure Portal

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Azure Functions | ~$0.50 | Consumption plan, 1M requests |
| Azure OpenAI | ~$20-100 | Depends on prompts/questions |
| Azure Search | ~$50 | Basic tier |
| Total | ~$70-150 | Budget-friendly |

## Resources

- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure Search Docs](https://learn.microsoft.com/azure/search/)
- [Azure Functions Docs](https://learn.microsoft.com/azure/azure-functions/)
- [RAG Pattern Guide](https://learn.microsoft.com/azure/ai-services/openai/concepts/use-your-data)

## Support

### Getting Help
1. Check `CHATBOT_SETUP.md` for detailed guides
2. Review `CHATBOT_QUICK_START.md` for common issues
3. Check Azure Portal Logs
4. Review browser console dev tools

### Common Issues
- Missing environment variables → Check `.env` and Azure appsettings
- API 404 → Verify Azure Function is published and URL is correct
- CORS errors → Check allowed origins in ChatFunction
- No search results → Verify index exists and documents uploaded

## Next Steps

After deployment:
1. 🎨 Customize widget appearance (colors, position)
2. 📚 Add more documents from your blog/projects
3. 🔐 Enable user authentication (optional)
4. 📊 Set up monitoring and alerting
5. 🚀 Share with visitors and gather feedback

## License

This project is provided as-is for your personal use. Feel free to modify and customize.

---

**Created**: March 2026
**Website**: Your awesome resume site
**Powered by**: Azure OpenAI + Azure Search + Node.js

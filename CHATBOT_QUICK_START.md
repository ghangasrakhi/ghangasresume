# Chatbot Quick Start Guide

## 5-Minute Setup Summary

This guide gets your chatbot running in minutes. For detailed setup, see `CHATBOT_SETUP.md`.

### Step 1: Prepare Azure Resources (15 mins)

```bash
# 1. Create resource group
az group create --name chatbot-rg --location eastus

# 2. Create Azure OpenAI
az cognitiveservices account create \
  --name my-chatbot-openai \
  --resource-group chatbot-rg \
  --kind OpenAI \
  --sku s0 \
  --location eastus

# 3. Create Azure AI Search  
az search service create \
  --name my-chatbot-search \
  --resource-group chatbot-rg \
  --location eastus \
  --sku standard
```

### Step 2: Get Your API Keys (5 mins)

```bash
# Get OpenAI endpoint and key
az cognitiveservices account show \
  --name my-chatbot-openai \
  --resource-group chatbot-rg \
  --query properties.endpoints.OpenAI

# Copy the output, you'll need it for .env file

# Get Search key
az search admin-key show \
  --service-name my-chatbot-search \
  --resource-group chatbot-rg
```

### Step 3: Deploy Model in Azure OpenAI (5 mins)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your OpenAI resource
3. Click "Deployments" in the left menu
4. Click "Create new deployment"
5. Select a supported model such as `gpt-4.1-mini` or `gpt-4o-mini`.
6. Choose a deployment name, e.g. `gpt-4.1-mini`.
7. Click "Create"

### Step 4: Configure Environment (2 mins)

Copy the `.env.example` to `.env`:

```bash
cd api
cp .env.example .env
```

Edit `.env` with your values:

```env
AZURE_OPENAI_ENDPOINT=https://my-chatbot-openai.openai.azure.com/
AZURE_OPENAI_KEY=your-key-from-step-2
AZURE_OPENAI_DEPLOYMENT_ID=gpt-35-turbo
AZURE_SEARCH_ENDPOINT=https://my-chatbot-search.search.windows.net
AZURE_SEARCH_KEY=your-search-key
AZURE_SEARCH_INDEX=documents
```

### Step 5: Deploy Azure Function (5 mins)

```bash
# Install dependencies
cd api
npm install

# Create function app
az functionapp create \
  --resource-group chatbot-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name my-chatbot-api

# Deploy
func azure functionapp publish my-chatbot-api

# Set environment variables
az functionapp config appsettings set \
  --name my-chatbot-api \
  --resource-group chatbot-rg \
  --settings \
  AZURE_OPENAI_ENDPOINT=https://my-chatbot-openai.openai.azure.com/ \
  AZURE_OPENAI_KEY=your-key \
  AZURE_OPENAI_DEPLOYMENT_ID=<your-deployment-name> \
  AZURE_SEARCH_ENDPOINT=https://my-chatbot-search.search.windows.net \
  AZURE_SEARCH_KEY=your-search-key \
  AZURE_SEARCH_INDEX=documents
```

### Step 6: Update Website Configuration (2 mins)

Find and update all these lines in your HTML files (index.html, about.html, portfolio.html, blog.html):

```javascript
apiUrl: 'https://your-api.azurewebsites.net/api/chat',
```

Replace with your actual API URL:

```javascript
apiUrl: 'https://my-chatbot-api.azurewebsites.net/api/chat',
```

### Step 7: Upload Test Documents (5 mins)

Create `upload-docs.js` in the api folder:

```javascript
const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
require('dotenv').config();

const documents = [
  {
    id: "1",
    title: "DevOps Skills",
    content: "Rakhi specializes in cloud platforms, CI/CD, containerization, and infrastructure automation. Expert in Azure, Kubernetes, Docker, and Terraform.",
    source: "resume.md"
  },
  {
    id: "2",
    title: "Experience",
    content: "DevOps Engineer at Interactive Pty Ltd since 2023. Cloud Engineer at Walter & Eliza Hall Institute 2019-2023. Experience with cloud infrastructure, automation, and monitoring.",
    source: "resume.md"
  },
  {
    id: "3",
    title: "Education",
    content: "Master of Information Technology from LaTrobe University (2017-2019). Strong background in IT and software development.",
    source: "education.md"
  }
];

async function uploadDocuments() {
  try {
    const client = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT,
      process.env.AZURE_SEARCH_INDEX,
      new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
    );

    const result = await client.uploadDocuments(documents);
    console.log("✓ Uploaded", result.length, "documents successfully!");
  } catch (error) {
    console.error("✗ Upload failed:", error.message);
  }
}

uploadDocuments();
```

Run it:

```bash
node upload-docs.js
```

### Step 8: Test It!

```bash
# Test API directly
curl -X POST https://my-chatbot-api.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What are Rakhi'\''s skills?", "history":[]}'
```

Or test in browser:
1. Open `https://your-website.com`
2. Look for chat widget in bottom-right (💬)
3. Click it to open
4. Type: "What are Rakhi's skills?"
5. Should see response with citations

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Chat widget not showing | Check API URL in HTML is correct |
| "API error" message | Verify Azure Function is deployed: `func azure functionapp list` |
| No chat response | Check env vars: `az functionapp config appsettings list --name my-chatbot-api --resource-group chatbot-rg` |
| Search results are empty | Upload test documents with `node upload-docs.js` |
| "Invalid deployment" error | Verify model deployed in Azure: `az cognitiveservices account deployment list --name my-chatbot-openai --resource-group chatbot-rg` |

## Commands Reference

```bash
# View function logs
func azure functionapp logstream my-chatbot-api --build remote

# View env variables
az functionapp config appsettings list --name my-chatbot-api --resource-group chatbot-rg

# Update a setting
az functionapp config appsettings set --name my-chatbot-api --resource-group chatbot-rg --settings KEY=VALUE

# Delete everything
az group delete --name chatbot-rg --yes
```

## Local Development (Optional)

Test locally before deploying:

```bash
cd api
npm install
func start
```

Then in another terminal:

```bash
curl -X POST http://localhost:7071/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello", "history":[]}'
```

## Next Steps

1. ✅ Deploy Azure resources
2. ✅ Configure environment
3. ✅ Upload documents
4. ✅ Test chatbot
5. 📊 Monitor with Application Insights
6. 🔐 Enable authentication (production)
7. 🎨 Customize widget appearance
8. 📱 Test on mobile

## Support

- Stuck? Check the full guide: `CHATBOT_SETUP.md`
- Azure issues? Visit: https://learn.microsoft.com/azure/
- Chat widget code: Look in `Frontend/js/chatbot.js`

## Success! 🎉

Your chatbot is now live! Users can:
- Ask questions about your resume
- Get intelligent answers with citations
- Use it from any page on your site
- Access it from mobile devices

---

**Estimated total setup time: 45 minutes**
**Main cost: Azure OpenAI + Search (free tier available for testing)**

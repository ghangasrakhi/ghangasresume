# Visual Setup Guide

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR WEBSITE                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Chatbot Widget (JavaScript)              │  │
│  │                                                       │  │
│  │    User Types Message  →  Widget Sends to API       │  │
│  │    ↓                                                  │  │
│  │    💬 Chat Interface                                 │  │
│  │    ┌─────────────────────┐                          │  │
│  │    │ User: "Hi!"         │                          │  │
│  │    │ Bot: "Hello! How..." │                          │  │
│  │    └─────────────────────┘                          │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │ HTTP POST to API                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              AZURE FUNCTION (Chat API)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Receive: {"message": "Hi!", "history": [...]}   │     │
│  │                                                  │     │
│  │ Process:                                         │     │
│  │ 1. Take the user message                        │     │
│  │ 2. Search for relevant documents                │     │
│  │ 3. Build context from search results           │     │
│  │ 4. Ask GPT with context                        │     │
│  │ 5. Format response with citations              │     │
│  │                                                  │     │
│  │ Return: {                                        │     │
│  │   "message": "Hello! How can I help?",          │     │
│  │   "sources": [{"title": "...", ...}]           │     │
│  │ }                                                │     │
│  └──────────────────┬──────┬──────────────────────┘     │
└─────────────────────┼──────┼──────────────────────────┘
                      │      │
      ┌───────────────┘      └──────────────┐
      │                                    │
      ▼                                    ▼
  ┌─────────────┐                 ┌──────────────┐
  │   SEARCH    │                 │   OpenAI     │
  │   (Azure)   │                 │   (Azure)    │
  │             │                 │              │
  │ Documents:  │                 │ GPT model:   │
  │• Products   │◄────────────────▶ Generate    │
  │• Policies   │  Context         Response     │
  │• FAQs       │  + Question                    │
  │• Blog       │                                │
  └─────────────┘                 └──────────────┘
        ▲
        │ Upload documents once
        │
  ┌─────────────┐
  │ Your Data   │
  │             │
  │ Resume      │
  │ Experience  │
  │ Skills      │
  │ Projects    │
  └─────────────┘
```

## Information Flow

### Step 1: User Interaction
```
User clicks chat widget
        ↓
Widget opens in bottom-right
        ↓
User types message & presses Send
        ↓
Message sent to Azure Function
```

### Step 2: Search & Retrieval
```
Function receives message
        ↓
"What are your skills?"
        ↓
Search Azure Search index
        ↓
Find matching documents:
✓ Core Technical Skills
✓ Experience
        ↓
Extract relevant content
```

### Step 3: AI Processing
```
Format prompt:
- System instructions
- Found documents
- Conversation history
- User question
        ↓
Send to Azure OpenAI
        ↓
GPT model processes and generates response
        ↓
Response: "DevOps Engineer with expertise in..."
```

### Step 4: Response Display
```
Function formats response:
{
  "message": "DevOps Engineer...",
  "sources": [
    {"title": "Core Technical Skills", "source": "skills.md"}
  ]
}
        ↓
Send back to widget
        ↓
Widget displays message with citation
        ↓
User sees response with [1] reference
```

## Deployment Flow

```
Step 1: Setup Azure
┌─────────────────────────────────┐
│ Create Resource Group           │
│ Create OpenAI Service           │
│ Create AI Search Service        │
│ Create Search Index             │
└────────────┬────────────────────┘
             ▼
Step 2: Configure
┌─────────────────────────────────┐
│ Copy .env.example to .env       │
│ Fill in API keys & endpoints    │
│ Verify all settings             │
└────────────┬────────────────────┘
             ▼
Step 3: Deploy
┌─────────────────────────────────┐
│ npm install (dependencies)      │
│ Create Azure Function App       │
│ npm run deploy (upload code)    │
│ Set env vars in Azure           │
└────────────┬────────────────────┘
             ▼
Step 4: Populate Data
┌─────────────────────────────────┐
│ npm run upload-docs             │
│ Upload sample documents to      │
│ Azure Search index              │
└────────────┬────────────────────┘
             ▼
Step 5: Integrate
┌─────────────────────────────────┐
│ Update API URL in HTML files    │
│ index.html                      │
│ about.html                      │
│ portfolio.html                  │
│ blog.html                       │
└────────────┬────────────────────┘
             ▼
Step 6: Test & Launch
┌─────────────────────────────────┐
│ Open website in browser         │
│ Click chat widget (💬)          │
│ Send test messages              │
│ Verify responses appear         │
│ Check citations work            │
└─────────────────────────────────┘
```

## Azure Resources Layout

```
Subscription
├── chatbot-rg (Resource Group)
│   ├── my-chatbot-openai
│   │   ├── Deployment: <your-deployment-name>  # e.g. chat-model
│   │   │   └── Used for: AI responses
│   │   └── Endpoint: https://my-chatbot-openai.openai.azure.com
│   │
│   ├── my-chatbot-search
│   │   ├── Index: documents
│   │   │   └── Fields: id, title, content, source
│   │   │   └── Populated with: Your resume data
│   │   └── Endpoint: https://my-chatbot-search.search.windows.net
│   │
│   └── my-chatbot-api (Function App)
│       ├── ChatFunction
│       │   └── Endpoint: https://my-chatbot-api.azurewebsites.net/api/chat
│       └── Settings: Environment variables (API keys)
```

## Data Flow Example

```
USER INPUT
"What DevOps tools do you use?"
    │
    ▼
┌──────────────────────┐
│ Chatbot Widget       │
│ (Frontend/js/       │
│  chatbot.js)         │
│                      │
│ Formats request:     │
│ {                    │
│   message: "What...",│
│   history: [...]     │
│ }                    │
└──────────┬───────────┘
           │ HTTP POST
           ▼
┌──────────────────────┐
│ Azure Function       │
│ /api/chat endpoint   │
│                      │
│ Receives request     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Azure Search         │
│                      │
│ Query: "DevOps tools"│
│ Results:             │
│ - Doc 1: Skills      │
│   (Contains Docker,  │
│    K8s, Terraform)   │
│ - Doc 2: Tools       │
│   (CI/CD, monitoring)│
│                      │
│ Return 3 top matches │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│ Context Building         │
│                          │
│ Combine:                 │
│ 1. System prompt         │
│ 2. Search results        │
│ 3. Conversation history  │
│ 4. User question         │
│                          │
│ Build final message:     │
│ "You are a helpful      │
│  assistant. Based on    │
│  these documents...     │
│  Answer: DevOps tools?" │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────┐
│ Azure OpenAI (GPT)   │
│                      │
│ Process the question │
│ with context         │
│                      │
│ Generate response:   │
│ "I use Docker for    │
│  containerization,   │
│  Kubernetes for      │
│  orchestration..."   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│ Format Response          │
│                          │
│ {                        │
│   message: "I use...",   │
│   sources: [             │
│     {                    │
│       title: "Skills",   │
│       source: "resume"   │
│     }                    │
│   ]                      │
│ }                        │
└──────────┬───────────────┘
           │ HTTP Response
           ▼
┌──────────────────────┐
│ Chatbot Widget       │
│                      │
│ Display:             │
│ ┌──────────────────┐ │
│ │ Bot: "I use..."  │ │
│ │ [1] Skills       │ │
│ └──────────────────┘ │
└──────────────────────┘
           │
           ▼
        USER SEES RESPONSE!
```

## File Organization

```
Your Website Root
│
├── api/                           ← Azure Function Code
│   ├── ChatFunction/
│   │   ├── function.json         ← Configuration
│   │   └── index.js              ← Chat logic (288 lines)
│   ├── sample-documents.js       ← Resume data (8 docs)
│   ├── upload-docs.js            ← Uploader script
│   ├── deploy.js                 ← Deployment script
│   ├── package.json              ← npm dependencies
│   ├── .env.example              ← Config template
│   ├── .env                       ← Your live secrets
│   └── .gitignore                ← Safety (excludes .env)
│
├── Frontend/                      ← Website Frontend
│   ├── js/
│   │   ├── chatbot.js            ← Widget (680+ lines) ⭐
│   │   └── other-scripts.js      ← Existing scripts
│   ├── index.html                ← Updated with widget
│   ├── about.html                ← Updated with widget
│   ├── portfolio.html            ← Updated with widget
│   └── blog.html                 ← Updated with widget
│
└── Docs/
    ├── IMPLEMENTATION_SUMMARY.md  ← This overview
    ├── CHATBOT_QUICK_START.md    ← 5-minute guide
    ├── CHATBOT_SETUP.md          ← Detailed guide
    └── api/README_CHATBOT.md     ← API reference
```

## API Endpoints

```
POST /api/chat
├── Input:
│   ├── message (string)      - User's question
│   └── history (array)       - Previous messages
│
└── Output:
    ├── message (string)      - AI response
    └── sources (array)       - Document citations
```

### Example Request:
```json
{
  "message": "What are your top skills?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

### Example Response:
```json
{
  "message": "As a DevOps Engineer, my top skills include: Cloud platforms (Azure, AWS), Kubernetes, Docker, CI/CD pipelines, Infrastructure as Code (Terraform, Bicep), and monitoring solutions.",
  "sources": [
    {
      "title": "Core Technical Skills",
      "source": "skills.md"
    }
  ]
}
```

## Deployment Timeline

```
Day 1 (Setup)
├── 08:00 - Create Azure resources (30 min)
├── 08:30 - Deploy OpenAI model (15 min)
├── 08:45 - Configure environment (10 min)
└── 09:00 - Dependencies installed

Day 1 (Deployment)
├── 09:00 - Deploy function (5 min)
├── 09:05 - Set env variables (5 min)
├── 09:10 - Upload documents (2 min)
└── 09:15 - Update website URLs (5 min)

Day 1 (Testing)
├── 09:20 - Terminal test with curl (2 min)
├── 09:25 - Browser test (5 min)
├── 09:30 - Verify all pages work (5 min)
└── 09:35 - Go live! 🎉

Total Time: ~1.5 hours
```

## Success Indicators

✅ **You'll know it's working when:**

1. Chat widget appears on your website (💬 icon)
2. Widget opens when clicked
3. You can type messages
4. Await loading indicator appears
5. Bot responds within 5-10 seconds
6. Response includes citations
7. Conversation history appears
8. Works on mobile devices
9. Light/dark themes toggle
10. No console errors (F12 → Console)

❌ **If something doesn't work:**

1. Check browser console (F12)
2. View function logs: `func azure functionapp logstream my-chatbot-api`
3. Verify API URL in HTML matches deployed function
4. Check environment variables in Azure
5. See CHATBOT_SETUP.md → Troubleshooting

---

**Ready to deploy?** Start with `CHATBOT_QUICK_START.md`!

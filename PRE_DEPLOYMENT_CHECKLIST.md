# Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying your chatbot.

## ✅ Code & Files

- [ ] **ChatFunction created**
  - [ ] `api/ChatFunction/function.json` exists
  - [ ] `api/ChatFunction/index.js` exists
  - [ ] Can see chat logic in index.js

- [ ] **Chatbot widget created**
  - [ ] `Frontend/js/chatbot.js` exists (680+ lines)
  - [ ] Widget CSS is included
  - [ ] No syntax errors (run: `npm --version`)

- [ ] **Pages updated**
  - [ ] `Frontend/index.html` has chatbot script
  - [ ] `Frontend/about.html` has chatbot script
  - [ ] `Frontend/portfolio.html` has chatbot script
  - [ ] `Frontend/blog.html` has chatbot script

- [ ] **Configuration files**
  - [ ] `api/.env.example` exists
  - [ ] `api/sample-documents.js` exists
  - [ ] `api/upload-docs.js` exists
  - [ ] `api/deploy.js` exists

- [ ] **Documentation**
  - [ ] `IMPLEMENTATION_SUMMARY.md` exists
  - [ ] `CHATBOT_QUICK_START.md` exists
  - [ ] `CHATBOT_SETUP.md` exists
  - [ ] `VISUAL_SETUP_GUIDE.md` exists

## 🔧 Environment Setup

- [ ] **Node.js installed**
  ```bash
  node --version  # Should be v14+
  npm --version
  ```

- [ ] **Azure CLI installed**
  ```bash
  az --version    # Should show version info
  az login        # Should succeed
  ```

- [ ] **Azure signed in**
  ```bash
  az account show  # Shows your account
  ```

- [ ] **npm dependencies installed**
  ```bash
  cd api
  npm install     # No errors
  ```

## 🌐 Azure Resources

- [ ] **Resource group created**
  ```bash
  az group list --query "[].name" -o table
  # Should show your resource group name
  ```

- [ ] **Azure OpenAI created**
  - [ ] Name: `my-chatbot-openai` (or your chosen name)
  - [ ] SKU: Standard (S0)
  - [ ] Region: East US or your chosen region
  - [ ] Can access from portal

- [ ] **OpenAI model deployed**
  - [ ] Model: a currently supported OpenAI model (e.g. `gpt-4.1-mini`)
  - [ ] Deployment name: match the name you chose (e.g. `chat-model`)
  - [ ] Status: Succeeded (green checkmark)

- [ ] **Azure AI Search created**
  - [ ] Name: `my-chatbot-search` (or your name)
  - [ ] SKU: Basic or Standard
  - [ ] Region: Same as OpenAI (recommended)
  - [ ] Can access from portal

- [ ] **Search index created**
  - [ ] Index name: `documents`
  - [ ] Fields configured (id, title, content, source)
  - [ ] Can query (try test in portal)

## 🔑 API Keys & Endpoints

- [ ] **OpenAI credentials obtained**
  ```bash
  # From Azure Portal → OpenAI → Keys and Endpoint
  AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com/
  AZURE_OPENAI_KEY=xxxxxxxxxxxxx
  ```

- [ ] **Search credentials obtained**
  ```bash
  # From Azure Portal → Search → Keys
  AZURE_SEARCH_ENDPOINT=https://xxx.search.windows.net
  AZURE_SEARCH_KEY=xxxxxxxxxxxxx
  ```

- [ ] **Keys are correct**
  ```bash
  # Test with curl:
  curl https://YOUR_ENDPOINT/v1/models \
    -H "api-key: YOUR_KEY"
  # Should return 200 OK
  ```

## 🔐 Environment Configuration

- [ ] **`.env` file created**
  ```bash
  cd api
  cp .env.example .env  # File exists
  ```

- [ ] **`.env` properly filled**
  - [ ] `AZURE_OPENAI_ENDPOINT=https://...`
  - [ ] `AZURE_OPENAI_KEY=...`
  - [ ] `AZURE_OPENAI_DEPLOYMENT_ID=<your-deployment-name>`
  - [ ] `AZURE_SEARCH_ENDPOINT=https://...`
  - [ ] `AZURE_SEARCH_KEY=...`
  - [ ] `AZURE_SEARCH_INDEX=documents`

- [ ] **Security verified**
  - [ ] `.env` is in `.gitignore`
  - [ ] `.env` NOT committed to Git
  - [ ] Keys are never hardcoded in scripts

## 🚀 Function App Setup

- [ ] **Function app created in Azure**
  ```bash
  az functionapp show --name my-chatbot-api
  # Shows JSON with app details
  ```

- [ ] **Function ready to deploy**
  - [ ] Code is correct (no errors)
  - [ ] Dependencies installed (npm install done)
  - [ ] function.json is valid

- [ ] **Will set env variables post-deploy**
  - [ ] Process planned
  - [ ] Command ready: `az functionapp config appsettings set ...`

## 📚 Document Setup

- [ ] **Sample documents ready**
  - [ ] `api/sample-documents.js` has 8 documents
  - [ ] Documents have required fields: id, title, content, source
  - [ ] Can read the file (no syntax errors)

- [ ] **Upload script ready**
  - [ ] `api/upload-docs.js` exists
  - [ ] Script has error handling
  - [ ] Ready to run after deployment

## 🌐 Website Integration

- [ ] **API URL placeholder created**
  - [ ] All HTML files have: `apiUrl: 'https://your-api.azurewebsites.net/api/chat'`
  - [ ] Ready to replace after deployment

- [ ] **Widget script included**
  - [ ] `<script src="js/chatbot.js"></script>` added
  - [ ] Initialization code included
  - [ ] Configuration options set

- [ ] **HTML is valid**
  - [ ] No syntax errors in HTML
  - [ ] Scripts load in order
  - [ ] Page renders without errors (check dev tools)

## 🧪 Pre-Deployment Testing

- [ ] **Node.js dependency test**
  ```bash
  cd api
  npm list
  # Shows installed packages
  ```

- [ ] **Function code valid**
  ```bash
  # No syntax errors when reading:
  cat ChatFunction/index.js
  ```

- [ ] **Widget code valid**
  ```bash
  # No errors when opening chatbot.js
  # Can see full 680+ line file
  ```

- [ ] **Config file readable**
  ```bash
  cat .env.example
  # Shows template without errors
  ```

## 📋 Deployment Prerequisites

- [ ] **Computer has:**
  - [ ] Internet connection
  - [ ] Administrator access to Azure
  - [ ] ~30 minutes of time
  - [ ] Text editor (VS Code, Notepad++, etc.)

- [ ] **Azure subscription:**
  - [ ] Active subscription
  - [ ] Credit available (or free tier)
  - [ ] No quota limits exceeded

- [ ] **Permissions:**
  - [ ] Owner or Contributor role on subscription
  - [ ] Can create resources
  - [ ] Can deploy applications

## 🚦 Ready to Deploy?

### If ALL checkboxes are checked ✅
**You're ready!** Proceed to: `CHATBOT_QUICK_START.md`

### If some checkboxes are unchecked ❌
1. **Identify what's missing**
2. **Follow the corresponding guide**
   - Files issue? → Check `IMPLEMENTATION_SUMMARY.md`
   - Azure issue? → See `CHATBOT_SETUP.md` → Azure section
   - Config issue? → See `CHATBOT_QUICK_START.md` → Step 4
3. **Fix the issue**
4. **Return to this checklist**
5. **Check that item**

## Deployment Order

Once ready, follow this sequence:

```
1. Create Azure Resources
   (resource group, OpenAI, Search)
   
2. Deploy OpenAI Model
   (GPT-3.5 deployment)
   
3. Configure Environment
   (create & fill .env)
   
4. Install Dependencies
   (npm install)
   
5. Deploy Function
   (npm run deploy)
   
6. Set Azure Variables
   (environment settings)
   
7. Upload Documents
   (npm run upload-docs)
   
8. Update Website URLs
   (API endpoint in HTML)
   
9. Test & Launch
   (open website and test)
```

## Help & Support

If something is wrong:

1. **Check syntax**
   ```bash
   # JavaScript files
   node -c api/ChatFunction/index.js
   
   # JSON files
   cat api/ChatFunction/function.json
   ```

2. **Check logs**
   ```bash
   npm list                    # All packages
   az account show             # Azure login
   az group list               # Resource groups
   ```

3. **Check documentation**
   - CHATBOT_QUICK_START.md → Troubleshooting
   - CHATBOT_SETUP.md → Complete guide
   - VISUAL_SETUP_GUIDE.md → Diagrams

4. **Check browser**
   - Open website
   - Press F12
   - Check Console for errors
   - Check Network tab



---

**Status: _______________** (Ready ✅ or Needs Work ❌)

**Date Completed: _______________**

**Notes:**
```
_________________________________
_________________________________
_________________________________
```

Once all boxes are checked, you're ready to deploy! 🚀

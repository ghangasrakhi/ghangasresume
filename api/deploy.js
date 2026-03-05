#!/usr/bin/env node

/**
 * Chatbot Deployment Script
 * 
 * Automates the deployment of the chatbot to Azure
 * 
 * Usage:
 *   node deploy.js
 * 
 * What it does:
 * 1. Validates environment variables
 * 2. Creates Azure resources if needed
 * 3. Deploys the function to Azure
 * 4. Sets environment variables in Azure
 * 5. Uploads sample documents
 * 
 * Prerequisites:
 * - Azure CLI installed and authenticated
 * - az login completed
 * - .env file configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function step(message) {
  log(`▶ ${message}`, 'cyan');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// Validate environment
function validateEnvironment() {
  section('Validating Environment');
  
  // Check Azure CLI
  try {
    execSync('az --version', { stdio: 'ignore' });
    success('Azure CLI is installed');
  } catch {
    error('Azure CLI is not installed');
    process.exit(1);
  }
  
  // Check .env file
  if (!fs.existsSync('.env')) {
    error('.env file not found');
    log('Please copy .env.example to .env and fill in your values', 'yellow');
    process.exit(1);
  }
  
  success('.env file found');
  
  // Check required environment variables
  require('dotenv').config();
  
  const required = [
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_KEY',
    'AZURE_OPENAI_DEPLOYMENT_ID',
    'AZURE_SEARCH_ENDPOINT',
    'AZURE_SEARCH_KEY',
    'AZURE_SEARCH_INDEX'
  ];
  
  const missing = required.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    error(`Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  success('All required environment variables are set');
}

// Install dependencies
function installDependencies() {
  section('Installing Dependencies');
  
  step('Installing npm packages...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    success('npm packages installed');
  } catch {
    error('Failed to install npm packages');
    process.exit(1);
  }
}

// Deploy function to Azure
function deployFunction(functionAppName, resourceGroup) {
  section('Deploying Azure Function');
  
  step(`Publishing to Azure Function App: ${functionAppName}`);
  
  try {
    execSync(`func azure functionapp publish ${functionAppName}`, { 
      stdio: 'inherit' 
    });
    success('Function deployed successfully');
  } catch {
    error('Failed to deploy function');
    warning('Make sure the function app exists in Azure');
    warning('Run: az functionapp create --help for more info');
    process.exit(1);
  }
}

// Set environment variables in Azure
function setAzureEnvironmentVariables(functionAppName, resourceGroup) {
  section('Configuring Azure Function App');
  
  require('dotenv').config();
  
  const settings = [
    `AZURE_OPENAI_ENDPOINT=${process.env.AZURE_OPENAI_ENDPOINT}`,
    `AZURE_OPENAI_KEY=${process.env.AZURE_OPENAI_KEY}`,
    `AZURE_OPENAI_DEPLOYMENT_ID=${process.env.AZURE_OPENAI_DEPLOYMENT_ID}`,
    `AZURE_SEARCH_ENDPOINT=${process.env.AZURE_SEARCH_ENDPOINT}`,
    `AZURE_SEARCH_KEY=${process.env.AZURE_SEARCH_KEY}`,
    `AZURE_SEARCH_INDEX=${process.env.AZURE_SEARCH_INDEX}`
  ];
  
  step('Setting environment variables in Azure...');
  
  try {
    const settingsString = settings.join(' ');
    execSync(`az functionapp config appsettings set --name ${functionAppName} --resource-group ${resourceGroup} --settings ${settingsString}`, 
      { stdio: 'inherit' }
    );
    success('Environment variables configured in Azure');
  } catch {
    error('Failed to set environment variables');
    warning('You may need to set them manually in Azure Portal');
  }
}

// Upload sample documents
async function uploadSampleDocuments() {
  section('Uploading Sample Documents');
  
  step('Uploading documents to Azure Search...');
  
  try {
    const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
    const sampleDocuments = require('./sample-documents.js');
    require('dotenv').config();
    
    const client = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT,
      process.env.AZURE_SEARCH_INDEX,
      new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
    );
    
    const result = await client.uploadDocuments(sampleDocuments);
    success(`Uploaded ${result.length} sample documents to Azure Search`);
    
    log('\nDocuments uploaded:');
    sampleDocuments.forEach((doc, index) => {
      log(`  ${index + 1}. ${doc.title}`, 'dim');
    });
    
  } catch (error) {
    error(`Failed to upload documents: ${error.message}`);
    warning('You can upload documents manually later using: node upload-docs.js');
  }
}

// Get function URL
function getFunctionUrl(functionAppName) {
  try {
    const url = execSync(
      `az functionapp show --name ${functionAppName} --resource-group $(az functionapp show --name ${functionAppName} -o tsv --query resourceGroup) -o tsv --query defaultHostName`,
      { encoding: 'utf-8' }
    ).trim();
    
    return `https://${url}/api/chat`;
  } catch {
    return `https://${functionAppName}.azurewebsites.net/api/chat`;
  }
}

// Display final instructions
function displayInstructions(functionAppName, functionUrl) {
  section('Deployment Complete! 🎉');
  
  success('Your chatbot has been deployed to Azure!');
  
  log('\n📝 Next steps:', 'bright');
  
  log('\n1. Update your website with the API URL:', 'yellow');
  log(`   Find this line in your HTML files (index.html, about.html, etc.):`, 'dim');
  log(`   apiUrl: 'https://your-api.azurewebsites.net/api/chat',`, 'dim');
  log(`\n   And replace it with:`, 'dim');
  log(`   apiUrl: '${functionUrl}',`, 'green');
  
  log('\n2. Deploy your website to Azure Static Web Apps or your host', 'yellow');
  
  log('\n3. Test the chatbot:', 'yellow');
  log(`   - Open your website in a browser`, 'dim');
  log(`   - Look for the chat widget (💬) in the bottom right`, 'dim');
  log(`   - Type a message and send it`, 'dim');
  
  log('\n4. Monitor your function:', 'yellow');
  log(`   az functionapp logstream ${functionAppName}`, 'dim');
  
  log('\n📊 Useful commands:', 'bright');
  log(`   View logs:  func azure functionapp logstream ${functionAppName}`, 'dim');
  log(`   View settings: az functionapp config appsettings list --name ${functionAppName} --resource-group [resource-group]`, 'dim');
  
  log('\n🎨 Customization:', 'bright');
  log('   - Edit Frontend/js/chatbot.js to customize widget appearance', 'dim');
  log('   - Edit api/sample-documents.js to add more content', 'dim');
  log('   - Run "node upload-docs.js" to update documents in Azure Search', 'dim');
  
  log('\n📚 Documentation:', 'bright');
  log('   - CHATBOT_SETUP.md - Detailed setup guide', 'dim');
  log('   - CHATBOT_QUICK_START.md - Quick reference guide', 'dim');
  log('   - api/README_CHATBOT.md - API and widget documentation', 'dim');
  
  log('\n' + '='.repeat(60) + '\n');
}

// Main deployment
async function deploy() {
  log('╔════════════════════════════════════════════════════════╗', 'bright');
  log('║     Chatbot Deployment Script for Azure Functions      ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝', 'bright');
  
  // Get configuration from user or environment
  const functionAppName = process.env.AZURE_FUNCTION_APP_NAME || 'chatbot-api';
  const resourceGroup = process.env.AZURE_RESOURCE_GROUP || 'chatbot-rg';
  
  try {
    validateEnvironment();
    installDependencies();
    
    log(`\nFunction App: ${functionAppName}`, 'cyan');
    log(`Resource Group: ${resourceGroup}`, 'cyan');
    
    // Check if function app exists
    section('Checking Azure Function App');
    step(`Checking if ${functionAppName} exists...`);
    
    try {
      execSync(`az functionapp show --name ${functionAppName} --resource-group ${resourceGroup}`, 
        { stdio: 'ignore' }
      );
      success(`Function app ${functionAppName} exists`);
    } catch {
      warning(`Function app ${functionAppName} not found`);
      error('Please create the function app first using:');
      log(`az functionapp create --name ${functionAppName} --resource-group ${resourceGroup} --runtime node --runtime-version 18 --functions-version 4 --consumption-plan-location eastus`, 'yellow');
      process.exit(1);
    }
    
    // Deploy
    deployFunction(functionAppName, resourceGroup);
    setAzureEnvironmentVariables(functionAppName, resourceGroup);
    
    // Upload documents
    await uploadSampleDocuments();
    
    // Get function URL
    const functionUrl = getFunctionUrl(functionAppName);
    
    // Display instructions
    displayInstructions(functionAppName, functionUrl);
    
  } catch (err) {
    error(`Deployment failed: ${err.message}`);
    process.exit(1);
  }
}

// Run deployment
deploy();

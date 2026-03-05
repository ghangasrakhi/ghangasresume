#!/usr/bin/env node

/**
 * Upload Sample Documents to Azure Search
 * 
 * This script uploads sample documents related to Rakhi's profile,
 * experience, skills, and projects to the Azure AI Search index.
 * 
 * Usage:
 *   node upload-docs.js
 * 
 * Requirements:
 *   - .env file configured with Azure Search credentials
 *   - Azure Search index created (with fields: id, title, content, source, category)
 */

const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
require('dotenv').config();

// Import sample documents
const sampleDocuments = require('./sample-documents.js');

// Validate environment variables
function validateEnvironment() {
  const required = ['AZURE_SEARCH_ENDPOINT', 'AZURE_SEARCH_KEY', 'AZURE_SEARCH_INDEX'];
  const missing = required.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
}

// Create search client
function createSearchClient() {
  return new SearchClient(
    process.env.AZURE_SEARCH_ENDPOINT,
    process.env.AZURE_SEARCH_INDEX,
    new AzureKeyCredential(process.env.AZURE_SEARCH_KEY)
  );
}

// Upload documents
async function uploadDocuments() {
  try {
    console.log('🚀 Starting document upload...\n');
    
    validateEnvironment();
    
    const client = createSearchClient();
    
    console.log(`📋 Uploading ${sampleDocuments.length} sample documents...`);
    console.log(`🔗 Search Index: ${process.env.AZURE_SEARCH_INDEX}`);
    console.log(`🌐 Endpoint: ${process.env.AZURE_SEARCH_ENDPOINT}\n`);
    
    // Upload documents
    const result = await client.uploadDocuments(sampleDocuments);
    
    console.log(`✅ Successfully uploaded ${result.length} documents!\n`);
    
    // Display what was uploaded
    console.log('📚 Documents uploaded:');
    sampleDocuments.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.title} (ID: ${doc.id})`);
    });
    
    console.log('\n✨ Ready to chat! The chatbot can now answer questions about:');
    console.log('   - Rakhi\'s professional experience and skills');
    console.log('   - Educational background');
    console.log('   - Projects and achievements');
    console.log('   - Technical certifications');
    console.log('   - Blog posts and articles\n');
    
    console.log('💡 Try asking the chatbot:');
    console.log('   - "What are Rakhi\'s main skills?"');
    console.log('   - "Where has Rakhi worked?"');
    console.log('   - "What certifications does Rakhi have?"');
    console.log('   - "Tell me about Rakhi\'s cloud experience"\n');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    
    if (error.message.includes('authorization')) {
      console.error('\n⚠️  Authorization error - check your API key');
    } else if (error.message.includes('not found')) {
      console.error('\n⚠️  Index not found - verify the index exists in Azure Search');
    } else if (error.message.includes('connection')) {
      console.error('\n⚠️  Connection error - check your endpoint URL');
    }
    
    process.exit(1);
  }
}

// Run the upload
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Azure AI Search - Document Upload Tool');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

uploadDocuments();

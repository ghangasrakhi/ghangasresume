/**
 * Chatbot Widget - Self-contained chat interface
 * Embed this in any HTML page to add a chatbot
 * 
 * Usage:
 * <script src="chatbot.js"></script>
 * <script>
 *   ChatbotWidget.init({
 *     apiUrl: 'https://your-api.azurewebsites.net/api/chat',
 *     position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
 *     title: 'Chat Assistant'
 *   });
 * </script>
 */

const ChatbotWidget = (function () {
  let config = {
    apiUrl: '',
    position: 'bottom-right',
    title: 'Chat Assistant',
    placeholder: 'Type your message...',
    theme: 'light'
  };

  let state = {
    isOpen: false,
    messages: [],
    isLoading: false
  };

  // Create and inject styles
  function injectStyles() {
    if (document.getElementById('chatbot-styles')) return;

    const style = document.createElement('style');
    style.id = 'chatbot-styles';
    style.textContent = `
      #chatbot-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        position: fixed;
        z-index: 9999;
        width: 380px;
        height: 600px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 1.5;
      }

      #chatbot-widget.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      #chatbot-widget.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      #chatbot-widget.top-right {
        top: 20px;
        right: 20px;
      }

      #chatbot-widget.top-left {
        top: 20px;
        left: 20px;
      }

      #chatbot-widget.light {
        background: white;
      }

      #chatbot-widget.dark {
        background: #1a1a1a;
        color: #e0e0e0;
      }

      #chatbot-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: default;
      }

      #chatbot-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .chatbot-close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .chatbot-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      #chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      #chatbot-messages.dark {
        background: #0a0a0a;
      }

      .chatbot-message {
        display: flex;
        margin-bottom: 8px;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chatbot-message.user {
        justify-content: flex-end;
      }

      .chatbot-message-content {
        max-width: 70%;
        padding: 8px 12px;
        border-radius: 6px;
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      .chatbot-message.assistant .chatbot-message-content {
        background: #f0f0f0;
        color: #333;
      }

      .chatbot-message.user .chatbot-message-content {
        background: #667eea;
        color: white;
      }

      #chatbot-widget.dark .chatbot-message.assistant .chatbot-message-content {
        background: #2a2a2a;
        color: #e0e0e0;
      }

      .chatbot-sources {
        font-size: 12px;
        margin-top: 4px;
        color: #666;
      }

      #chatbot-widget.dark .chatbot-sources {
        color: #999;
      }

      .chatbot-source-link {
        color: #667eea;
        text-decoration: none;
        margin-right: 8px;
      }

      #chatbot-widget.dark .chatbot-source-link {
        color: #88aaff;
      }

      .chatbot-typing {
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 8px 12px;
        background: #f0f0f0;
        border-radius: 6px;
        width: fit-content;
      }

      #chatbot-widget.dark .chatbot-typing {
        background: #2a2a2a;
      }

      .chatbot-typing span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #999;
        animation: typing 1.4s infinite;
      }

      .chatbot-typing span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .chatbot-typing span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% {
          opacity: 0.5;
        }
        30% {
          opacity: 1;
        }
      }

      #chatbot-input-area {
        padding: 12px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 8px;
      }

      #chatbot-widget.dark #chatbot-input-area {
        border-top-color: #2a2a2a;
        background: #1a1a1a;
      }

      #chatbot-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        max-height: 100px;
      }

      #chatbot-widget.dark #chatbot-input {
        background: #2a2a2a;
        border-color: #444;
        color: #e0e0e0;
      }

      #chatbot-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
      }

      #chatbot-input::placeholder {
        color: #999;
      }

      #chatbot-widget.dark #chatbot-input::placeholder {
        color: #666;
      }

      .chatbot-send-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s;
        min-width: 60px;
      }

      .chatbot-send-btn:hover:not(:disabled) {
        opacity: 0.9;
      }

      .chatbot-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      #chatbot-toggle-btn {
        position: fixed;
        z-index: 9998;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        cursor: pointer;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #chatbot-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      #chatbot-toggle-btn.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      #chatbot-toggle-btn.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      #chatbot-toggle-btn.top-right {
        top: 20px;
        right: 20px;
      }

      #chatbot-toggle-btn.top-left {
        top: 20px;
        left: 20px;
      }

      #chatbot-toggle-btn.hidden {
        display: none;
      }

      @media (max-width: 480px) {
        #chatbot-widget {
          width: 100%;
          height: 100%;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
        }

        #chatbot-widget.bottom-right,
        #chatbot-widget.bottom-left,
        #chatbot-widget.top-right,
        #chatbot-widget.top-left {
          bottom: 0;
          right: 0;
          left: 0;
          top: 0;
        }

        #chatbot-toggle-btn {
          display: none;
        }
      }

      .chatbot-error {
        background: #fee;
        color: #c33;
        padding: 8px 12px;
        border-radius: 4px;
        margin: 8px 0;
      }

      #chatbot-widget.dark .chatbot-error {
        background: #3a2a2a;
        color: #ff8888;
      }
    `;

    document.head.appendChild(style);
  }

  // Create DOM elements
  function createDOM() {
    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chatbot-toggle-btn';
    toggleBtn.className = `${config.position}`;
    toggleBtn.innerHTML = '💬';
    toggleBtn.setAttribute('aria-label', 'Toggle chat');

    // Widget container
    const widget = document.createElement('div');
    widget.id = 'chatbot-widget';
    widget.className = `${config.position} ${config.theme}`;
    widget.innerHTML = `
      <div id="chatbot-header">
        <h3>${config.title}</h3>
        <button class="chatbot-close-btn" aria-label="Close chat">×</button>
      </div>
      <div id="chatbot-messages" class="${config.theme}"></div>
      <div id="chatbot-input-area">
        <textarea id="chatbot-input" 
                  placeholder="${config.placeholder}"
                  rows="1"
                  aria-label="Chat message input"></textarea>
        <button id="chatbot-send-btn" class="chatbot-send-btn">Send</button>
      </div>
    `;

    widget.style.display = 'none';

    document.body.appendChild(toggleBtn);
    document.body.appendChild(widget);

    return { toggleBtn, widget };
  }

  // Attach event listeners
  function attachEventListeners(toggleBtn, widget) {
    const closeBtn = widget.querySelector('.chatbot-close-btn');
    const sendBtn = widget.querySelector('#chatbot-send-btn');
    const input = widget.querySelector('#chatbot-input');

    toggleBtn.addEventListener('click', () => {
      state.isOpen = !state.isOpen;
      widget.style.display = state.isOpen ? 'flex' : 'none';
      toggleBtn.classList.toggle('hidden', state.isOpen);
      if (state.isOpen) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      state.isOpen = false;
      widget.style.display = 'none';
      toggleBtn.classList.remove('hidden');
    });

    sendBtn.addEventListener('click', () => {
      const message = input.value.trim();
      if (message) {
        sendMessage(message);
        input.value = '';
        input.style.height = 'auto';
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
  }

  // Send message to API
  async function sendMessage(userMessage) {
    if (state.isLoading) return;

    if (!config.apiUrl) {
      showError('Chat API is not configured');
      return;
    }

    state.isLoading = true;
    addMessage('user', userMessage);
    showTyping();

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history: state.messages.slice(0, -1) // Exclude the last user message we just added
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      removeTyping();

      addMessage('assistant', data.message || 'No response received', data.sources);
      state.isLoading = false;
    } catch (error) {
      console.error('Chat error:', error);
      removeTyping();
      showError(`Unable to send message: ${error.message}`);
      state.isLoading = false;
    }
  }

  // Add message to chat
  function addMessage(role, content, sources = []) {
    state.messages.push({ role, content });

    const messagesDiv = document.getElementById('chatbot-messages');
    if (!messagesDiv) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);

    if (role === 'assistant' && sources && sources.length > 0) {
      const sourcesDiv = document.createElement('div');
      sourcesDiv.className = 'chatbot-sources';
      sources.forEach((source, index) => {
        const link = document.createElement('a');
        link.className = 'chatbot-source-link';
        link.href = '#';
        link.textContent = `[${index + 1}] ${source.title || source.source}`;
        link.target = '_blank';
        link.onclick = (e) => e.preventDefault();
        sourcesDiv.appendChild(link);
      });
      messageDiv.appendChild(sourcesDiv);
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const messagesDiv = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'chatbot-typing';
    typingDiv.className = 'chatbot-message assistant';
    typingDiv.innerHTML = `
      <div class="chatbot-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Remove typing indicator
  function removeTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  }

  // Show error message
  function showError(message) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'chatbot-error';
    errorDiv.textContent = message;
    messagesDiv.appendChild(errorDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Public API
  return {
    init: function (options) {
      config = { ...config, ...options };

      if (!config.apiUrl) {
        console.error('ChatbotWidget: apiUrl is required');
        return;
      }

      injectStyles();
      const { toggleBtn, widget } = createDOM();
      attachEventListeners(toggleBtn, widget);

      // Add initial greeting
      setTimeout(() => {
        if (state.messages.length === 0) {
          addMessage('assistant', `Hi! I'm ${config.title}. How can I help you today?`);
        }
      }, 100);
    },

    open: function () {
      const widget = document.getElementById('chatbot-widget');
      const toggleBtn = document.getElementById('chatbot-toggle-btn');
      if (widget && toggleBtn) {
        state.isOpen = true;
        widget.style.display = 'flex';
        toggleBtn.classList.add('hidden');
      }
    },

    close: function () {
      const widget = document.getElementById('chatbot-widget');
      const toggleBtn = document.getElementById('chatbot-toggle-btn');
      if (widget && toggleBtn) {
        state.isOpen = false;
        widget.style.display = 'none';
        toggleBtn.classList.remove('hidden');
      }
    },

    sendMessage: sendMessage,

    clearChat: function () {
      state.messages = [];
      const messagesDiv = document.getElementById('chatbot-messages');
      if (messagesDiv) {
        messagesDiv.innerHTML = '';
        addMessage('assistant', `Hi! I'm ${config.title}. How can I help you today?`);
      }
    }
  };
})();

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', function () {
  const script = document.currentScript;
  if (script && script.hasAttribute('data-api-url')) {
    ChatbotWidget.init({
      apiUrl: script.getAttribute('data-api-url'),
      position: script.getAttribute('data-position') || 'bottom-right',
      title: script.getAttribute('data-title') || 'Chat Assistant',
      theme: script.getAttribute('data-theme') || 'light'
    });
  }
});

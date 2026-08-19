import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface AttachedFile {
  name: string;
  content: string;
}

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello. How can I help you explore this codebase?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setAttachedFile({
          name: file.name,
          content: text
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be selected again if removed
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    const filePayload = attachedFile;
    
    let displayMessage = userText;
    if (filePayload) {
      displayMessage = `📎 [Attached: ${filePayload.name}]\n${userText}`;
    }

    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: displayMessage };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachedFile(null); // Clear file after sending
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText,
          fileName: filePayload?.name,
          fileContent: filePayload?.content
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: data.answer || 'No answer provided.' 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: `Error: Could not reach backend. ${err.message}` 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>CodeAtlas AI</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            <span className="message-sender">{msg.sender === 'ai' ? 'CodeAtlas' : 'You'}</span>
            <div className="message-content">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {attachedFile && (
          <div className="file-attachment-badge">
            <span className="file-name">📄 {attachedFile.name}</span>
            <button 
              type="button" 
              className="remove-file-btn"
              onClick={() => setAttachedFile(null)}
            >
              ×
            </button>
          </div>
        )}
        <form className="chat-input-form" onSubmit={handleSend}>
          <button 
            type="button" 
            className="attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach a text file"
          >
            📎
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".txt,.js,.ts,.tsx,.json,.md,.py,.cpp,.h,.css"
          />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..." 
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" className="chat-submit" disabled={isLoading}>
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

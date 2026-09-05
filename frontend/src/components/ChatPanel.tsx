import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gsap from 'gsap';
import { Scene } from './Scene';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AttachedFile {
  name: string;
  content: string;
}

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Orchestrator online. How can I assist you with this workspace?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [chatWidth, setChatWidth] = useState(40);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    if (messagesContainerRef.current) {
      const newMsgElements = messagesContainerRef.current.querySelectorAll('.chat-message:not(.animated)');
      if (newMsgElements.length > 0) {
        gsap.fromTo(
          newMsgElements,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
        newMsgElements.forEach(el => el.classList.add('animated'));
      }
    }
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      // Calculate chat width as a percentage of window width from the right
      const newChatWidth = 100 - (e.clientX / window.innerWidth) * 100;
      // Clamp between 20% and 75%
      if (newChatWidth > 20 && newChatWidth < 75) {
        setChatWidth(newChatWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
    e.target.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    const filePayload = attachedFile;
    
    let displayMessage = userText;
    if (filePayload) {
      displayMessage = `📎 [Attached: ${filePayload.name}]\n\n${userText}`;
    }

    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: displayMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:8080/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText,
          fileName: filePayload?.name,
          fileContent: filePayload?.content
        })
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error(`Server returned a non-JSON response. Status: ${res.status}`);
      }
      
      if (!res.ok) {
        throw new Error(data?.error || `Server error: ${res.status}`);
      }

      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: data?.answer || 'No answer provided.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: `Error: Could not process request. ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="responsive-stack" style={{ height: '100vh', width: '100%', display: 'flex', backgroundColor: '#080808' }}>
      
      <div className="mobile-scene" style={{ width: `${100 - chatWidth}%`, height: '100%', position: 'relative' }}>
        <Scene />
        <div style={{
          position: 'absolute', bottom: '1rem', left: '1.5rem',
          pointerEvents: 'none', zIndex: 10, opacity: 0.25
        }}>
          <span style={{ fontFamily: "'Valve', sans-serif", fontSize: '0.75rem', color: '#fff', letterSpacing: '0.1em' }}>CODEATLAS</span>
        </div>
      </div>

      <div 
        onMouseDown={() => {
          isDragging.current = true;
          document.body.style.cursor = 'col-resize';
        }}
        style={{
          width: '6px',
          cursor: 'col-resize',
          backgroundColor: '#0a0a0a',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #1a1a1a',
          borderRight: '1px solid #1a1a1a',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        onMouseLeave={(e) => { if (!isDragging.current) e.currentTarget.style.backgroundColor = '#0a0a0a'; }}
      >
        <div style={{ width: '2px', height: '24px', backgroundColor: '#333', borderRadius: '2px' }} />
      </div>

      <div className="mobile-chat" style={{
        width: `${chatWidth}%`, height: '100%',
        display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid #1a1a1a',
        backgroundColor: '#0a0a0a',
        zIndex: 10
      }}>
        
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#e5e5e5' }}>Workspace</h2>
          </div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
        </div>
        
        <div ref={messagesContainerRef} style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          backgroundColor: '#080808'
        }}>
          {messages.map(msg => (
            <div key={msg.id} className="chat-message" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{ 
                padding: '0.75rem 1rem', 
                maxWidth: '85%', 
                borderRadius: '12px',
                backgroundColor: msg.sender === 'user' ? '#151515' : 'transparent',
                color: '#c8c8c8',
                border: msg.sender === 'user' ? 'none' : '1px solid #1a1a1a',
                fontSize: '0.88rem',
                lineHeight: 1.7,
                fontFamily: 'Inter, sans-serif'
              }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #1a1a1a', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#333', animation: 'fadeInUp 0.6s ease infinite alternate' }}></div>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#333', animation: 'fadeInUp 0.6s ease 0.15s infinite alternate' }}></div>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#333', animation: 'fadeInUp 0.6s ease 0.3s infinite alternate' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #1a1a1a',
          backgroundColor: '#0a0a0a'
        }}>
          {attachedFile && (
            <div style={{
              padding: '0.4rem 0.75rem', marginBottom: '0.75rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              borderRadius: '6px', backgroundColor: '#111', border: '1px solid #222',
              fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace"
            }}>
              <i className="fa-solid fa-file-code" style={{ color: '#555', fontSize: '0.7rem' }}></i>
              <span style={{ color: '#aaa' }}>{attachedFile.name}</span>
              <button 
                onClick={() => setAttachedFile(null)} 
                style={{ border: 'none', background: 'none', color: '#555', cursor: 'pointer', fontSize: '0.7rem', padding: '0 2px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} style={{
            display: 'flex', gap: '0.5rem', alignItems: 'center',
            backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1a1a1a',
            padding: '4px 4px 4px 6px',
            transition: 'border-color 0.2s ease'
          }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '36px', height: '36px', padding: 0, flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderRadius: '8px', border: 'none', background: 'none',
                color: '#555', cursor: 'pointer', transition: 'color 0.2s ease'
              }}
              title="Attach File"
            >
              <i className="fa-solid fa-paperclip" style={{ fontSize: '0.85rem' }}></i>
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
              placeholder="Ask about your codebase..." 
              style={{
                flex: 1, border: 'none', outline: 'none',
                background: 'transparent', color: '#d4d4d4',
                fontSize: '0.88rem', fontFamily: 'Inter, sans-serif',
                padding: '0.5rem 0.25rem'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                height: '36px', padding: '0 1rem', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderRadius: '8px', border: 'none',
                backgroundColor: isLoading ? '#1a1a1a' : '#fff',
                color: isLoading ? '#555' : '#000',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 600, fontSize: '0.75rem',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'background-color 0.2s ease'
              }}
            >
              {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-arrow-up"></i>}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

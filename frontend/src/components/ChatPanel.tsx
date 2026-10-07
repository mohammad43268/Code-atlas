import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gsap from 'gsap';
import { Scene } from './Scene';
import '../index.css'; // Ensure variables are loaded

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
  const [selectedModel, setSelectedModel] = useState('gpt-oss:120b');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
        );
        newMsgElements.forEach(el => el.classList.add('animated'));
      }
    }
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newChatWidth = 100 - (e.clientX / window.innerWidth) * 100;
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
        setAttachedFile({ name: file.name, content: text });
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
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText,
          fileName: filePayload?.name,
          fileContent: filePayload?.content,
          model: selectedModel
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
        // Improved error handling as requested
        throw new Error(`[Status ${res.status}] ${data?.error || 'Unknown error occurred'}`);
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
        text: `${err.message}`, // Displays precise data.error and status
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="responsive-stack" style={{ height: '100vh', width: '100%', display: 'flex', backgroundColor: 'var(--bg)' }}>
      
      <div className="mobile-scene" style={{ width: `${100 - chatWidth}%`, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <Scene />
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '2rem',
          pointerEvents: 'none', zIndex: 10, opacity: 0.8
        }}>
          <span style={{ fontFamily: 'COMVOTA, sans-serif', fontSize: '2rem', color: 'var(--ink)', letterSpacing: '0.05em' }}>CODEATLAS</span>
        </div>
      </div>

      {/* Resizer */}
      <div 
        onMouseDown={() => {
          isDragging.current = true;
          document.body.style.cursor = 'col-resize';
        }}
        style={{
          width: '8px',
          cursor: 'col-resize',
          backgroundColor: 'var(--surface)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid var(--ink)',
          borderRight: '1px solid var(--ink)',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
        onMouseLeave={(e) => { if (!isDragging.current) e.currentTarget.style.backgroundColor = 'var(--surface)'; }}
      >
        <div style={{ width: '2px', height: '32px', backgroundColor: 'var(--ink)', borderRadius: '1px' }} />
      </div>

      <div className="mobile-chat" style={{
        width: `${chatWidth}%`, height: '100%',
        display: 'flex', flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        zIndex: 10
      }}>
        
        {/* Chat Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--ink)',
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'var(--surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workspace Control</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'relative' }}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                backgroundColor: 'var(--bg)',
                color: 'var(--ink)',
                border: '1px solid var(--ink)',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                fontWeight: 600,
                minWidth: '220px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '4px 4px 0px var(--ink)'
              }}
            >
              <span>{selectedModel}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.75rem', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}></i>
            </div>
            
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                width: '100%',
                marginTop: '8px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--ink)',
                boxShadow: '4px 4px 0px var(--ink)',
                zIndex: 100
              }}>
                {['gemma4:31b', 'nemotron-3-ultra', 'nemotron-3-super', 'gpt-oss:120b'].map((m) => (
                  <div
                    key={m}
                    onClick={() => {
                      setSelectedModel(m);
                      setIsDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}

            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--ink)', animation: 'pulse 2s infinite', flexShrink: 0, marginLeft: '8px' }}></div>
          </div>
        </div>
        
        {/* Messages */}
        <div ref={messagesContainerRef} style={{
          flex: 1, overflowY: 'auto', padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          backgroundColor: 'var(--bg)'
        }}>
          {messages.map(msg => (
            <div key={msg.id} className="chat-message" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{ 
                padding: '1rem 1.25rem', 
                maxWidth: '85%', 
                borderRadius: '0px',
                backgroundColor: msg.sender === 'user' ? 'var(--ink)' : 'var(--bg)',
                color: msg.sender === 'user' ? 'var(--bg)' : 'var(--ink)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--ink)',
                boxShadow: msg.sender === 'user' ? '4px 4px 0px var(--surface)' : '4px 4px 0px var(--ink)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                fontFamily: 'Inter, sans-serif'
              }}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--ink)', boxShadow: '4px 4px 0px var(--ink)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--ink)', animation: 'fadeInUp 0.6s ease infinite alternate' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--ink)', animation: 'fadeInUp 0.6s ease 0.15s infinite alternate' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--ink)', animation: 'fadeInUp 0.6s ease 0.3s infinite alternate' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid var(--ink)',
          backgroundColor: 'var(--surface)'
        }}>
          {attachedFile && (
            <div style={{
              padding: '0.5rem 1rem', marginBottom: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              backgroundColor: 'var(--bg)', border: '1px solid var(--ink)',
              fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace",
              boxShadow: '2px 2px 0px var(--ink)'
            }}>
              <i className="fa-solid fa-file-code" style={{ color: 'var(--ink)' }}></i>
              <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{attachedFile.name}</span>
              <button 
                onClick={() => setAttachedFile(null)} 
                style={{ border: 'none', background: 'none', color: 'var(--ink)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} style={{
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            backgroundColor: 'var(--bg)', border: '1px solid var(--ink)',
            padding: '8px',
            boxShadow: '4px 4px 0px var(--ink)',
            flexWrap: 'wrap'
          }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '44px', height: '44px', padding: 0, flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: '1px solid var(--ink)', background: 'var(--surface)',
                color: 'var(--ink)', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              title="Attach File"
            >
              <i className="fa-solid fa-paperclip" style={{ fontSize: '1rem' }}></i>
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
              placeholder="Ask the orchestrator..." 
              style={{
                flex: 1, border: 'none', outline: 'none',
                background: 'transparent', color: 'var(--ink)',
                fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                padding: '0.5rem'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                height: '44px', padding: '0 1.5rem', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: '1px solid var(--ink)',
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '0.85rem',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'opacity 0.2s ease'
              }}
            >
              {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <span>SEND</span>}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

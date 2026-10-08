import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIMessageRenderer } from './AIMessageRenderer';
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
    
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${API_BASE_URL}/ask?stream=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText,
          fileName: filePayload?.name,
          fileContent: filePayload?.content,
          model: selectedModel
        })
      });
      
      if (!res.ok) {
        let errorData;
        try { errorData = await res.json(); } catch { /* ignore */ }
        throw new Error(`[Status ${res.status}] ${errorData?.error || 'Unknown error occurred'}`);
      }

      if (!res.body) throw new Error('ReadableStream not supported in this browser.');
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setIsLoading(false); // Disable spinning loader as streaming starts

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.content) {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId ? { ...msg, text: msg.text + parsed.content } : msg
                ));
              }
            } catch (e) {
              console.error('Failed to parse SSE data', e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: msg.text + `\n\n**Error**: ${err.message}` } : msg
      ));
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
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 10
      }}>
        
        {/* Chat Header */}
        <div style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
            {/* Header left empty to match minimalist chat interface */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, position: 'relative' }}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                fontWeight: 500,
                minWidth: '180px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
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
                backgroundColor: 'var(--bg-solid)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                overflow: 'hidden',
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
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}

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
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-solid)',
                color: msg.sender === 'user' ? 'var(--bg-solid)' : 'var(--text-primary)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                marginTop: '4px'
              }}>
                <i className={`fa-solid ${msg.sender === 'user' ? 'fa-user' : 'fa-robot'}`} style={{ fontSize: '0.8rem' }}></i>
              </div>
              
              <div style={{ 
                padding: '1rem 1.25rem', 
                maxWidth: '85%', 
                width: msg.sender === 'ai' ? '100%' : 'auto',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-elevated)',
                color: msg.sender === 'user' ? 'var(--bg-solid)' : 'var(--text-primary)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflowX: 'auto'
              }}>
                {msg.sender === 'ai' ? (
                  <AIMessageRenderer content={msg.text} />
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-highlight)', animation: 'fadeInUp 0.6s ease infinite alternate' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-highlight)', animation: 'fadeInUp 0.6s ease 0.15s infinite alternate' }}></div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-highlight)', animation: 'fadeInUp 0.6s ease 0.3s infinite alternate' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1.5rem 2rem',
          backgroundColor: 'transparent'
        }}>
          {attachedFile && (
            <div style={{
              padding: '0.5rem 1rem', marginBottom: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '0.85rem', fontFamily: 'Inter, sans-serif'
            }}>
              <i className="fa-solid fa-file-code" style={{ color: 'var(--text-secondary)' }}></i>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{attachedFile.name}</span>
              <button 
                onClick={() => setAttachedFile(null)} 
                style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} style={{
            display: 'flex', gap: '0.5rem', alignItems: 'center',
            backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            borderRadius: '30px',
            padding: '8px 8px 8px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            flexWrap: 'wrap'
          }}>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '36px', height: '36px', padding: 0, flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: 'none', background: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s ease',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                padding: '0.5rem'
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '40px', height: '40px', flexShrink: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                border: 'none',
                backgroundColor: 'var(--text-primary)',
                color: '#080808',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
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

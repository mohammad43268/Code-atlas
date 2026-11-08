import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { AIMessageRenderer } from './AIMessageRenderer';
import gsap from 'gsap';
import { Scene } from './Scene';
import { useOrchestrator } from '../context/useOrchestrator';
import { RepoSearchBar } from './orchestrator/RepoSearchBar';
import { TelemetryHUD } from './orchestrator/TelemetryHUD';
import { NodeInspector } from './orchestrator/NodeInspector';
import '../index.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  contextNodePath?: string;
  modelUsed?: string;
}

interface AttachedFile {
  name: string;
  content: string;
}

const MODEL_OPTIONS = [
  { id: 'gpt-oss:120b', label: 'GPT-OSS 120B', desc: 'Deep Architecture & Multi-File Reasoning', tag: 'High-Reasoning' },
  { id: 'gemma4:31b', label: 'Gemma 4 31B', desc: 'Low Latency Spatial Code Analysis', tag: 'Fast' },
  { id: 'nemotron-3-ultra', label: 'Nemotron-3 Ultra', desc: 'Multi-Module Systems Reasoning', tag: 'Systems' },
  { id: 'nemotron-3-super', label: 'Nemotron-3 Super', desc: 'Fast Dependency Mapping & Analysis', tag: 'Graph' }
];

const STARTER_PROMPTS = [
  {
    icon: 'fa-bolt',
    title: 'Architectural Overview',
    desc: 'Module topology & core design patterns',
    prompt: 'Analyze the high-level architecture of this repository, module boundaries, and core design patterns.'
  },
  {
    icon: 'fa-diagram-project',
    title: 'Dependency Bottlenecks',
    desc: 'Coupling analysis & circular references',
    prompt: 'Examine the repository dependency structure. Identify tightly-coupled files or potential architectural bottlenecks.'
  },
  {
    icon: 'fa-network-wired',
    title: 'Data & State Flow',
    desc: 'Client-to-server contracts & data pathways',
    prompt: 'Explain the data and state lifecycle in this project, tracing interactions from UI components to state and services.'
  },
  {
    icon: 'fa-gauge-high',
    title: 'Performance Audit',
    desc: 'Render latency & code-splitting check',
    prompt: 'Conduct a performance and bundle size audit. Point out heavy imports, render risks, and optimization opportunities.'
  }
];

class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('ThreeJS Scene Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#080808',
            color: 'var(--text-secondary)',
            gap: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <i
            className="fa-solid fa-cube"
            style={{ fontSize: '2.5rem', color: 'var(--accent-highlight)' }}
          />
          <span style={{ fontSize: '0.95rem' }}>3D Space encountered a render glitch.</span>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 18px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--ink)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            Restart 3D Scene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ChatPanel: React.FC = () => {
  const { pinnedContextNode, setPinnedContextNode, focusNode, graph } = useOrchestrator();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Orchestrator online. 3D spatial mapping active. Click any node in the 3D graph to inspect files, focus the camera, or pin code to prompt context.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gpt-oss:120b'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [chatWidth, setChatWidth] = useState(42);
  const [selectedModel, setSelectedModel] = useState('gpt-oss:120b');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animate newly added messages
  useEffect(() => {
    scrollToBottom();
    if (messagesContainerRef.current) {
      const newMsgElements = messagesContainerRef.current.querySelectorAll('.chat-message:not(.animated)');
      if (newMsgElements.length > 0) {
        gsap.fromTo(
          newMsgElements,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', stagger: 0.04 }
        );
        newMsgElements.forEach((el) => el.classList.add('animated'));
      }
    }
  }, [messages.length]);

  // Keep view scrolled down during active AI streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  // RAF-throttled smooth split-pane dragging
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const newChatWidth = 100 - (e.clientX / window.innerWidth) * 100;
        if (newChatWidth > 25 && newChatWidth < 70) {
          setChatWidth(newChatWidth);
        }
      });
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
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

  const executeSend = useCallback(async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userText = queryText;
    const filePayload = attachedFile;
    const currentPinned = pinnedContextNode;

    let displayMessage = userText;
    let contextPrompt = '';

    if (currentPinned) {
      contextPrompt += `[Active 3D Node: ${currentPinned.path} (${currentPinned.type}${
        currentPinned.lineCount ? `, ~${currentPinned.lineCount} lines` : ''
      })]\n`;
    }

    if (filePayload) {
      displayMessage = `📎 Attached: **${filePayload.name}**\n\n${userText}`;
    }

    const finalQuestion = contextPrompt ? `${contextPrompt}\nUser Question: ${userText}` : userText;

    const newMsg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      sender: 'user',
      text: displayMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextNodePath: currentPinned?.path
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);

    const aiMessageId = `${Date.now() + 1}-${Math.random()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${API_BASE_URL}/ask?stream=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: finalQuestion,
          fileName: filePayload?.name || (currentPinned ? currentPinned.name : undefined),
          fileContent: filePayload?.content,
          model: selectedModel
        })
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          // ignore
        }
        throw new Error(`[Status ${res.status}] ${errorData?.error || 'Unknown server error'}`);
      }

      if (!res.body) throw new Error('ReadableStream not supported in this browser.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      setIsLoading(false);

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
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId ? { ...msg, text: msg.text + parsed.content } : msg
                  )
                );
              }
            } catch (e) {
              console.error('Failed to parse SSE chunk', e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Chat Error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: msg.text + `\n\n> ⚠️ **Error**: ${err.message}` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, attachedFile, pinnedContextNode, selectedModel]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    executeSend(input);
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: 'Session reset. 3D spatial mapping active. Ready for repository queries.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);
  }, [selectedModel]);

  return (
    <div
      className="responsive-stack"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        backgroundColor: '#080808',
        overflow: 'hidden'
      }}
    >
      {/* 3D Scene Viewport Pane */}
      <div
        className="mobile-scene"
        style={{
          width: `${100 - chatWidth}%`,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#080808'
        }}
      >
        {/* Cockpit Back to Landing Button */}
        <Link
          to="/"
          className="glass-hud"
          title="Return to Landing Page (ESC)"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 50,
            color: 'var(--text-primary)',
            borderRadius: '20px',
            padding: '7px 14px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            fontSize: '0.74rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.75rem' }} />
          <span>ATLAS</span>
          <span className="orchestrator-kbd" style={{ fontSize: '0.6rem' }}>
            ESC
          </span>
        </Link>

        {/* 3D Viewport Controls & HUD Overlays */}
        <RepoSearchBar />
        <TelemetryHUD />
        <NodeInspector />

        {/* Dynamic 3D Canvas */}
        <SceneErrorBoundary>
          <Scene />
        </SceneErrorBoundary>

        {/* Bottom Left Cartography Watermark & Matrix Readout */}
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            left: '20px',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span
            style={{
              fontFamily: 'Comvota, sans-serif',
              fontSize: '1.4rem',
              color: 'var(--ink)',
              letterSpacing: '0.08em',
              lineHeight: 1
            }}
          >
            CODEATLAS
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            3D CARTOGRAPHY ENGINE // MATRIX [ACTIVE]
          </span>
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={() => {
          isDragging.current = true;
          document.body.style.cursor = 'col-resize';
        }}
        style={{
          width: '5px',
          cursor: 'col-resize',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-highlight)';
        }}
        onMouseLeave={(e) => {
          if (!isDragging.current) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }
        }}
      >
        <div
          style={{
            width: '2px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '1px'
          }}
        />
      </div>

      {/* Right AI Orchestrator Chat Pane */}
      <div
        className="mobile-chat"
        style={{
          width: `${chatWidth}%`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0c10',
          borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 20
        }}
      >
        {/* Chat Studio Header */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(14, 17, 22, 0.95)',
            backdropFilter: 'blur(16px)',
            gap: '12px'
          }}
        >
          {/* Header Title & Workspace Telemetry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-highlight)',
                display: 'inline-block',
                boxShadow: '0 0 10px rgba(0, 255, 204, 0.7)',
                flexShrink: 0
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  ARCHITECTURE COPILOT
                </span>
                <span
                  className="orchestrator-kbd"
                  style={{
                    fontSize: '0.62rem',
                    color: 'var(--accent-highlight)',
                    borderColor: 'rgba(0, 255, 204, 0.25)'
                  }}
                >
                  LIVE
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={graph.repoName}
              >
                {graph.repoName} ({graph.branch})
              </span>
            </div>
          </div>

          {/* Model Selector & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
              >
                <i className="fa-solid fa-microchip" style={{ color: 'var(--accent-highlight)', fontSize: '0.72rem' }} />
                <span>{selectedModel}</span>
                <i
                  className="fa-solid fa-chevron-down"
                  style={{
                    fontSize: '0.65rem',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: 'var(--text-muted)'
                  }}
                />
              </button>

              {/* Model Picker Flyout */}
              {isDropdownOpen && (
                <div
                  className="glass-hud"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '290px',
                    marginTop: '8px',
                    borderRadius: '12px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 100
                  }}
                >
                  <div
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.66rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em'
                    }}
                  >
                    Select Inference Model
                  </div>
                  {MODEL_OPTIONS.map((m) => {
                    const isCurrent = m.id === selectedModel;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          backgroundColor: isCurrent ? 'rgba(0, 255, 204, 0.1)' : 'transparent',
                          border: isCurrent ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: isCurrent ? 'var(--accent-highlight)' : 'var(--text-primary)'
                            }}
                          >
                            {m.label}
                          </span>
                          <span
                            style={{
                              fontSize: '0.62rem',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {m.tag}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                          {m.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clear Chat Button */}
            <button
              type="button"
              onClick={handleClearChat}
              title="Clear Session History"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.76rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ff5252';
                e.currentTarget.style.borderColor = 'rgba(255, 82, 82, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <i className="fa-solid fa-trash-can" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#0a0c10'
          }}
        >
          {/* Welcome Card & Starter Prompts if fresh session */}
          {messages.length === 1 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(16, 20, 26, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(0, 255, 204, 0.12)',
                    border: '1px solid var(--accent-highlight)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-highlight)'
                  }}
                >
                  <i className="fa-solid fa-cubes-stacked" style={{ fontSize: '0.9rem' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0
                    }}
                  >
                    Spatial Code Intelligence & Copilot
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                    Select any 3D node to inspect or launch an architectural prompt below.
                  </p>
                </div>
              </div>

              {/* 4 Quick Starter Prompt Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                {STARTER_PROMPTS.map((sp) => (
                  <div
                    key={sp.title}
                    className="prompt-suggestion-card"
                    onClick={() => executeSend(sp.prompt)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i
                        className={`fa-solid ${sp.icon}`}
                        style={{ color: 'var(--accent-highlight)', fontSize: '0.75rem' }}
                      />
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {sp.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {sp.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className="chat-message"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  alignSelf: isUser ? 'flex-end' : 'stretch',
                  maxWidth: isUser ? '85%' : '100%'
                }}
              >
                {/* Message Header Strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isUser ? 'flex-end' : 'space-between',
                    gap: '8px',
                    padding: '0 4px',
                    fontSize: '0.68rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--text-muted)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: isUser ? 'var(--text-muted)' : 'var(--accent-highlight)', fontWeight: 600 }}>
                      {isUser ? '[OPERATOR]' : '[ORCHESTRATOR // SPATIAL-AI]'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy Response"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedMessageId === msg.id ? 'var(--accent-highlight)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 4px'
                        }}
                      >
                        <i className={`fa-solid ${copiedMessageId === msg.id ? 'fa-check' : 'fa-copy'}`} />
                        <span>{copiedMessageId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* If user sent message with pinned 3D node tag */}
                {msg.contextNodePath && (
                  <button
                    type="button"
                    onClick={() => focusNode(msg.contextNodePath!)}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      background: 'rgba(0, 255, 204, 0.08)',
                      border: '1px solid rgba(0, 255, 204, 0.3)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      color: 'var(--accent-highlight)',
                      fontSize: '0.72rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to jump camera to this node in 3D"
                  >
                    <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '0.7rem' }} />
                    <span>3D FOCUS: {msg.contextNodePath}</span>
                  </button>
                )}

                {/* Message Body Card */}
                <div
                  style={{
                    padding: isUser ? '10px 14px' : '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: isUser ? 'rgba(26, 32, 42, 0.85)' : 'rgba(16, 19, 25, 0.85)',
                    color: 'var(--text-primary)',
                    border: isUser
                      ? '1px solid rgba(0, 255, 204, 0.25)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isUser
                      ? '0 4px 16px rgba(0,0,0,0.3)'
                      : '0 8px 24px rgba(0,0,0,0.4)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    fontFamily: 'Inter, sans-serif',
                    overflowX: 'auto'
                  }}
                >
                  {isUser ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <AIMessageRenderer content={msg.text} onNodeClick={focusNode} />
                  )}
                </div>
              </div>
            );
          })}

          {/* Active Generation Shimmer Loader */}
          {isLoading && (
            <div
              className="chat-message"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(16, 19, 25, 0.85)',
                border: '1px solid rgba(0, 255, 204, 0.2)',
                width: 'fit-content'
              }}
            >
              <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--accent-highlight)', fontSize: '0.85rem' }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)'
                }}
              >
                Synthesizing architectural reasoning...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock & Context Pin Bar */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(14, 17, 22, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Active Context Indicators */}
          {(pinnedContextNode || attachedFile) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {pinnedContextNode && (
                <div
                  style={{
                    padding: '4px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(0, 255, 204, 0.1)',
                    border: '1px solid var(--accent-highlight)',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  <i className="fa-solid fa-thumbtack" style={{ color: 'var(--accent-highlight)', fontSize: '0.72rem' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    3D Node: <strong style={{ color: 'var(--accent-highlight)' }}>{pinnedContextNode.path}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPinnedContextNode(null)}
                    title="Unpin 3D Context"
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0 2px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              )}

              {attachedFile && (
                <div
                  style={{
                    padding: '4px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  <i className="fa-solid fa-file-code" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{attachedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0 2px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form Command Bar */}
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(20, 24, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '8px 12px',
              gap: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the 3D orchestrator, analyze architecture, or trace data flows..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontFamily: 'Inter, sans-serif',
                padding: '4px 2px'
              }}
              disabled={isLoading}
            />

            {/* Bottom Dock Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach Code / Text File"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <i className="fa-solid fa-paperclip" />
                  <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace" }}>Attach</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".txt,.js,.ts,.tsx,.json,.md,.py,.cpp,.h,.css"
                />

                <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="orchestrator-kbd">↵ SEND</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !attachedFile)}
                style={{
                  background: input.trim() || attachedFile ? 'var(--accent-highlight)' : 'rgba(255, 255, 255, 0.08)',
                  color: input.trim() || attachedFile ? '#080808' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: isLoading || (!input.trim() && !attachedFile) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <i className="fa-solid fa-arrow-up" style={{ fontSize: '0.7rem' }} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

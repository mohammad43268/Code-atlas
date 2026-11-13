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
    prompt: 'Analyze the high-level architecture of this repository, module boundaries, and core design patterns.',
    color: '#818CF8',
    bg: 'rgba(99, 102, 241, 0.12)'
  },
  {
    icon: 'fa-diagram-project',
    title: 'Dependency Bottlenecks',
    desc: 'Coupling analysis & circular references',
    prompt: 'Examine the repository dependency structure. Identify tightly-coupled files or potential architectural bottlenecks.',
    color: '#FB7185',
    bg: 'rgba(244, 63, 94, 0.12)'
  },
  {
    icon: 'fa-network-wired',
    title: 'Data & State Flow',
    desc: 'Client-to-server contracts & data pathways',
    prompt: 'Explain the data and state lifecycle in this project, tracing interactions from UI components to state and services.',
    color: '#34D399',
    bg: 'rgba(16, 185, 129, 0.12)'
  },
  {
    icon: 'fa-gauge-high',
    title: 'Performance Audit',
    desc: 'Render latency & code-splitting check',
    prompt: 'Conduct a performance and bundle size audit. Point out heavy imports, render risks, and optimization opportunities.',
    color: '#FBBF24',
    bg: 'rgba(245, 158, 11, 0.12)'
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
            backgroundColor: '#0B0D12',
            color: '#94A3B8',
            gap: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <i
            className="fa-solid fa-cube"
            style={{ fontSize: '2.25rem', color: '#38BDF8' }}
          />
          <span style={{ fontSize: '0.92rem', color: '#F1F5F9' }}>3D Viewport encountered a render glitch.</span>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 18px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 500,
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
  const { pinnedContextNode, setPinnedContextNode, focusNode, graph, selectedNode } = useOrchestrator();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Orchestrator online. 3D spatial mapping active. Select any 3D node to inspect files, focus the camera, or pin code to prompt context.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gpt-oss:120b'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [chatWidth, setChatWidth] = useState(38);
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
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.04 }
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
        if (newChatWidth > 24 && newChatWidth < 65) {
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

  const activeSelectionLabel = selectedNode
    ? (selectedNode.type === 'folder' ? `${selectedNode.path.replace(/\/+$/, '')}/` : selectedNode.name)
    : 'None';

  const contextBadgeText = pinnedContextNode
    ? `@${pinnedContextNode.path}`
    : selectedNode
    ? `@${selectedNode.path}`
    : `@${graph.repoName || 'Code-atlas'}`;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0B0D12',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 2.A: UNIFIED TOP APPLICATION TITLEBAR (44px, Full Width) */}
      <header
        style={{
          height: '44px',
          width: '100%',
          backgroundColor: '#111318',
          borderBottom: '1px solid #222631',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 60
        }}
      >
        {/* Left: Navigation & Active Repo Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Link
            to="/"
            title="Return to Landing Page (ESC)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: '#1A1D24',
              color: '#CBD5E1',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background-color 0.18s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#242832')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A1D24')}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: '11px', color: '#94A3B8' }} />
            <span>Atlas</span>
          </Link>

          <div style={{ width: '1px', height: '16px', backgroundColor: '#262A36' }} />

          {/* Repo Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <i className="fa-brands fa-github" style={{ color: '#94A3B8', fontSize: '13px' }} />
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#E2E8F0',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '220px'
              }}
              title={graph.repoName}
            >
              {graph.repoName || 'mohammad43268 / Code-atlas'}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#1E293B',
                color: '#38BDF8',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                padding: '2px 7px',
                borderRadius: '4px',
                flexShrink: 0
              }}
            >
              <span>⎇</span>
              <span>{graph.branch || 'main'}</span>
            </span>
          </div>
        </div>

        {/* Center: Command Palette / Repo Input Bar */}
        <RepoSearchBar />

        {/* Right: Telemetry Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: '#171A21',
              border: '1px solid #232733',
              borderRadius: '5px',
              padding: '2px 8px',
              color: '#818CF8'
            }}
          >
            <strong>{graph.nodes.length}</strong> Nodes
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: '#171A21',
              border: '1px solid #232733',
              borderRadius: '5px',
              padding: '2px 8px',
              color: '#38BDF8'
            }}
          >
            <strong>{graph.connections.length}</strong> Edges
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: '#171A21',
              border: '1px solid #232733',
              borderRadius: '5px',
              padding: '2px 8px',
              color: '#F59E0B'
            }}
          >
            <strong>{graph.totalFolders}</strong> Dirs
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: '#171A21',
              border: '1px solid #232733',
              borderRadius: '5px',
              padding: '2px 8px',
              color: '#10B981'
            }}
          >
            <strong>{graph.totalFiles}</strong> Files
          </div>
        </div>
      </header>

      {/* MAIN DOCKED WORKSPACE (3D Canvas + Copilot Sidebar) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Left: 3D Viewport Pane */}
        <div
          style={{
            width: `${100 - chatWidth}%`,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#0B0D12'
          }}
        >
          {/* Top-Left Floating Active Node Inspector Chip */}
          <NodeInspector />

          {/* Bottom-Center Figma Toolbar (Reset | Orbit | Grid | 1x) */}
          <TelemetryHUD />

          {/* 3D WebGL Canvas */}
          <SceneErrorBoundary>
            <Scene />
          </SceneErrorBoundary>
        </div>

        {/* 1px Resizer Handle */}
        <div
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
          }}
          style={{
            width: '4px',
            cursor: 'col-resize',
            backgroundColor: '#1E222B',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.18s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6366F1')}
          onMouseLeave={(e) => {
            if (!isDragging.current) e.currentTarget.style.backgroundColor = '#1E222B';
          }}
        />

        {/* Right: Architecture Copilot Sidebar (Cursor / Discord Grade) */}
        <div
          style={{
            width: `${chatWidth}%`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#14171F',
            borderLeft: '1px solid #222631',
            zIndex: 20
          }}
        >
          {/* 5.A: Compact Panel Header (44px) */}
          <div
            style={{
              height: '44px',
              padding: '0 14px',
              borderBottom: '1px solid #222631',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#14171F',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-sparkles" style={{ color: '#818CF8', fontSize: '13px' }} />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#F1F5F9',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Architecture Copilot
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#34D399',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  letterSpacing: '0.04em'
                }}
              >
                Live
              </span>
            </div>

            {/* Model Selector & Trash Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    backgroundColor: '#1B1F2A',
                    color: '#E2E8F0',
                    border: '1px solid #2A303F',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11.5px',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'border-color 0.18s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2A303F')}
                >
                  <i className="fa-solid fa-microchip" style={{ color: '#818CF8', fontSize: '10px' }} />
                  <span>{selectedModel}</span>
                  <i
                    className="fa-solid fa-chevron-down"
                    style={{
                      fontSize: '9px',
                      color: '#64748B',
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s'
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '280px',
                      borderRadius: '8px',
                      padding: '6px',
                      backgroundColor: '#161922',
                      border: '1px solid #282E3D',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      zIndex: 100
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontFamily: "'JetBrains Mono', monospace",
                        textTransform: 'uppercase',
                        color: '#64748B',
                        letterSpacing: '0.06em'
                      }}
                    >
                      Inference Engine
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
                            padding: '6px 8px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            backgroundColor: isCurrent ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                            border: isCurrent ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '11px',
                                fontWeight: 600,
                                color: isCurrent ? '#818CF8' : '#F1F5F9'
                              }}
                            >
                              {m.label}
                            </span>
                            <span
                              style={{
                                fontSize: '9px',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: '#94A3B8'
                              }}
                            >
                              {m.tag}
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', color: '#64748B', lineHeight: 1.3 }}>
                            {m.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Session History"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  color: '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.backgroundColor = 'transparent';
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
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: '#14171F'
            }}
          >
            {/* 5.B: Refined Quick-Action Starter Cards (No giant outer container box) */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      margin: 0
                    }}
                  >
                    Spatial Code Intelligence &amp; Copilot
                  </h3>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Select any 3D node to inspect or launch an architectural prompt below.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                  {STARTER_PROMPTS.map((sp) => (
                    <button
                      key={sp.title}
                      type="button"
                      onClick={() => executeSend(sp.prompt)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#1A1E29',
                        border: '1px solid #252A3A',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#212634';
                        e.currentTarget.style.borderColor = '#384152';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1A1E29';
                        e.currentTarget.style.borderColor = '#252A3A';
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: sp.bg,
                          color: sp.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px'
                        }}
                      >
                        <i className={`fa-solid ${sp.icon}`} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12.5px',
                            fontWeight: 500,
                            color: '#E2E8F0',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {sp.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.35, marginTop: '2px' }}>
                          {sp.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5.C: IDE-Grade Chat Messages */}
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
                    width: '100%'
                  }}
                >
                  {/* Clean Discord/Cursor Style Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 2px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '5px',
                          background: isUser
                            ? 'linear-gradient(135deg, #334155, #1E293B)'
                            : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          flexShrink: 0
                        }}
                      >
                        <i className={`fa-solid ${isUser ? 'fa-user' : 'fa-robot'}`} />
                      </div>
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: isUser ? '#94A3B8' : '#E2E8F0',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {isUser ? 'Operator' : 'CodeAtlas AI'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy Response"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedMessageId === msg.id ? '#34D399' : '#64748B',
                          cursor: 'pointer',
                          fontSize: '10.5px',
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 4px'
                        }}
                      >
                        <i className={`fa-solid ${copiedMessageId === msg.id ? 'fa-check' : 'fa-copy'}`} />
                        <span>{copiedMessageId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  {/* Context Node focus badge */}
                  {msg.contextNodePath && (
                    <button
                      type="button"
                      onClick={() => focusNode(msg.contextNodePath!)}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        color: '#38BDF8',
                        fontSize: '11px',
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginLeft: '28px'
                      }}
                      title="Focus this node in 3D scene"
                    >
                      <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '10px' }} />
                      <span>3D Focus: {msg.contextNodePath}</span>
                    </button>
                  )}

                  {/* Message Body Card */}
                  <div
                    style={{
                      marginLeft: '28px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isUser ? '#181C26' : '#191D26',
                      border: '1px solid #232836',
                      color: '#CBD5E1',
                      fontSize: '13px',
                      lineHeight: 1.55,
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: '28px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#191D26',
                  border: '1px solid #232836',
                  width: 'fit-content'
                }}
              >
                <i className="fa-solid fa-circle-notch fa-spin" style={{ color: '#818CF8', fontSize: '12px' }} />
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11.5px',
                    color: '#94A3B8'
                  }}
                >
                  Synthesizing architectural reasoning...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 5.D: Cursor-Style Bottom Composer Box (Single Send Button Bug Fix) */}
          <div
            style={{
              padding: '10px 12px 12px',
              backgroundColor: '#14171F',
              borderTop: '1px solid #222631'
            }}
          >
            <form
              onSubmit={handleSend}
              style={{
                backgroundColor: '#1A1E29',
                border: '1px solid #2B3142',
                borderRadius: '10px',
                padding: '10px 12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'border-color 0.18s ease'
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#2B3142')}
            >
              {/* Top Context Chip Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#242938',
                    color: '#94A3B8',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: '2px 7px',
                    borderRadius: '4px',
                    border: '1px solid #2E3547'
                  }}
                >
                  <i className="fa-solid fa-at" style={{ fontSize: '9px', color: '#818CF8' }} />
                  <span>{contextBadgeText}</span>
                  {pinnedContextNode && (
                    <button
                      type="button"
                      onClick={() => setPinnedContextNode(null)}
                      title="Unpin 3D Context"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '10px',
                        marginLeft: '2px'
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>

                {attachedFile && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      color: '#818CF8',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <i className="fa-solid fa-file-code" style={{ fontSize: '10px' }} />
                    <span>{attachedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '10px'
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot about architecture, dependencies, or @nodes..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F1F5F9',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  padding: '2px 0'
                }}
              />

              {/* Bottom Action Row: Attach on left, Single primary Send button on right */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px'
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach Code / Text File"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11.5px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E2E8F0')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                >
                  <i className="fa-solid fa-paperclip" />
                  <span>Attach</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".txt,.js,.ts,.tsx,.json,.md,.py,.cpp,.h,.css"
                />

                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  style={{
                    backgroundColor: input.trim() || attachedFile ? '#4F46E5' : '#252936',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: isLoading || (!input.trim() && !attachedFile) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'background-color 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() || attachedFile) e.currentTarget.style.backgroundColor = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    if (input.trim() || attachedFile) e.currentTarget.style.backgroundColor = '#4F46E5';
                  }}
                >
                  {isLoading ? (
                    <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '11px' }} />
                  ) : (
                    <>
                      <span>Send</span>
                      <span>↵</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 2.B: BOTTOM DESKTOP STATUS BAR (24px, Full Width) */}
      <footer
        style={{
          height: '24px',
          width: '100%',
          backgroundColor: '#0E1015',
          borderTop: '1px solid #1E222B',
          fontSize: '11px',
          color: '#64748B',
          padding: '0 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 60,
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        {/* Left Status Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 6px #10B981'
            }}
          />
          <span style={{ color: '#94A3B8' }}>Spatial Engine Ready</span>
          <span style={{ color: '#2B3142' }}>|</span>
          <span>
            Active Selection: <strong style={{ color: '#E2E8F0' }}>{activeSelectionLabel}</strong>
          </span>
        </div>

        {/* Right Status Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>WebGL2 Graph</span>
          <span style={{ color: '#2B3142' }}>•</span>
          <span>UTF-8</span>
          <span style={{ color: '#2B3142' }}>•</span>
          <span>AI: <strong style={{ color: '#818CF8' }}>{selectedModel}</strong></span>
        </div>
      </footer>
    </div>
  );
};

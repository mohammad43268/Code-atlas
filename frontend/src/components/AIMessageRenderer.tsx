import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface AIMessageRendererProps {
  content: string;
}

export const AIMessageRenderer: React.FC<AIMessageRendererProps> = ({ content }) => {
  return (
    <div className="ai-message-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Inline code
            if (!match && !String(children).includes('\n')) {
              return (
                <code
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.2em 0.4em',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                  }}
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            // Block code
            return (
              <CodeBlock language={language} code={String(children).replace(/\n$/, '')} />
            );
          },
          table({ children }) {
            return (
              <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return <th style={{ borderBottom: '2px solid var(--border-subtle)', padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>{children}</th>;
          },
          td({ children }) {
            return <td style={{ borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem' }}>{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote style={{
                borderLeft: '4px solid var(--accent-highlight)',
                margin: '1rem 0',
                padding: '0.5rem 0 0.5rem 1rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0 4px 4px 0'
              }}>
                {children}
              </blockquote>
            );
          },
          a({ children, href }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-highlight)', textDecoration: 'underline' }}>
                {children}
              </a>
            );
          },
          h1({ children }) { return <h1 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>{children}</h1>; },
          h2({ children }) { return <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>{children}</h2>; },
          h3({ children }) { return <h3 style={{ marginTop: '1.25rem', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>{children}</h3>; },
          p({ children }) { return <p style={{ marginBottom: '1rem' }}>{children}</p>; },
          ul({ children }) { return <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ul>; },
          ol({ children }) { return <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ol>; },
          li({ children }) { return <li style={{ marginBottom: '0.25rem' }}>{children}</li>; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#0d1117', 
      borderRadius: '8px',
      margin: '1rem 0',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#161b22',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: '#8b949e',
        fontFamily: 'Inter, sans-serif'
      }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{language || 'text'}</span>
        <button 
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? '#3fb950' : '#8b949e',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            transition: 'color 0.2s ease'
          }}
        >
          {copied ? <><i className="fa-solid fa-check"></i> Copied!</> : <><i className="fa-regular fa-copy"></i> Copy</>}
        </button>
      </div>
      <div style={{ padding: '16px', overflowX: 'auto' }}>
        <code className={`hljs language-${language}`} style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5, background: 'transparent' }}>
          {code}
        </code>
      </div>
    </div>
  );
};

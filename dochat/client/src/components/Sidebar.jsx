import React, { useRef } from 'react'

export default function Sidebar({ docs, activeDoc, onSelectDoc, onUpload, uploading }) {
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') onUpload(file)
    e.target.value = ''
  }

  return (
    <aside style={{
      width: 220,
      background: 'var(--paper)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px 12px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          marginBottom: 12,
        }}>Library</div>

        {docs.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            No documents yet. Upload a PDF to begin.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {docs.map(doc => (
            <button
              key={doc._id}
              onClick={() => onSelectDoc(doc)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 6,
                border: 'none',
                background: activeDoc?._id === doc._id ? 'var(--cream-dark)' : 'transparent',
                textAlign: 'left',
                transition: 'background 0.12s',
                cursor: 'pointer',
                borderRight: activeDoc?._id === doc._id ? '2px solid var(--gold)' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (activeDoc?._id !== doc._id) e.currentTarget.style.background = 'var(--cream)'
              }}
              onMouseLeave={e => {
                if (activeDoc?._id !== doc._id) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>📄</span>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                }}>{doc.originalName}</div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: 'var(--ink-muted)',
                  marginTop: 2,
                }}>{doc.totalChunks} chunks</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div style={{ marginTop: 'auto', padding: '14px 16px' }}>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px dashed var(--border)',
            borderRadius: 8,
            background: 'transparent',
            color: uploading ? 'var(--ink-muted)' : 'var(--ink-light)',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = 'var(--cream)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {uploading ? '⏳ Processing...' : '+ Upload PDF'}
        </button>
      </div>
    </aside>
  )
}

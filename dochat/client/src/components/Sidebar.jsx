import React, { useRef } from 'react'

export default function Sidebar({
  docs,
  activeDoc,
  onSelectDoc,
  onUpload,
  uploading
}) {
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]

    if (file && file.type === 'application/pdf') {
      onUpload(file)
    }

    e.target.value = ''
  }

  return (
    <>
      <style>{`
        .sidebar {
          width: 220px;
          background: var(--paper);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          min-height: 0;
        }

        .sidebar-library {
          padding: 16px 18px 12px;
          border-bottom: 1px solid var(--border-light);
          overflow-y: auto;
          min-height: 0;
        }

        .sidebar-docs {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-upload {
          margin-top: auto;
          padding: 14px 16px;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 190px;
            max-height: 190px;
            border-right: none;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
          }

          .sidebar-library {
            padding: 10px 14px 8px;
            flex: 1;
            overflow-y: auto;
          }

          .sidebar-library-title {
            margin-bottom: 8px !important;
          }

          .sidebar-upload {
            margin-top: 0;
            padding: 8px 14px 10px;
          }

          .sidebar-docs {
            gap: 1px;
          }
        }
      `}</style>

      <aside className="sidebar">
        {/* Library */}
        <div className="sidebar-library">
          <div
            className="sidebar-library-title"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginBottom: 12,
            }}
          >
            Library
          </div>

          {docs.length === 0 && (
            <p
              style={{
                fontSize: 12,
                color: 'var(--ink-muted)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              No documents yet. Upload a PDF to begin.
            </p>
          )}

          <div className="sidebar-docs">
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
                  background:
                    activeDoc?._id === doc._id
                      ? 'var(--cream-dark)'
                      : 'transparent',
                  textAlign: 'left',
                  transition: 'background 0.12s',
                  cursor: 'pointer',
                  borderRight:
                    activeDoc?._id === doc._id
                      ? '2px solid var(--gold)'
                      : '2px solid transparent',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  if (activeDoc?._id !== doc._id) {
                    e.currentTarget.style.background = 'var(--cream)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeDoc?._id !== doc._id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  📄
                </span>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--ink)',
                      wordBreak: 'break-word',
                      lineHeight: 1.4,
                    }}
                  >
                    {doc.originalName}
                  </div>

                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9,
                      color: 'var(--ink-muted)',
                      marginTop: 2,
                    }}
                  >
                    {doc.totalChunks} chunks
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload */}
        <div className="sidebar-upload">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleFile}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px dashed var(--border)',
              borderRadius: 8,
              background: 'transparent',
              color: uploading
                ? 'var(--ink-muted)'
                : 'var(--ink-light)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.12s',
              cursor: uploading ? 'default' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!uploading) {
                e.currentTarget.style.background = 'var(--cream)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {uploading ? '⏳ Processing...' : '+ Upload PDF'}
          </button>
        </div>
      </aside>
    </>
  )
}
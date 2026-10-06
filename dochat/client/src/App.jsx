import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

const API_URL = import.meta.env.VITE_API_URL

const getOwnerId = () => {
  let ownerId = localStorage.getItem('docchat-owner-id')

  if (!ownerId) {
    ownerId = crypto.randomUUID()
    localStorage.setItem('docchat-owner-id', ownerId)
  }

  return ownerId
}

const OWNER_ID = getOwnerId()

export default function App() {
  const [docs, setDocs] = useState([])
  const [activeDoc, setActiveDoc] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/upload/list`, {
        headers: {
          'x-owner-id': OWNER_ID,
        },
      })

      setDocs(data)

      if (data.length > 0 && !activeDoc) {
        setActiveDoc(data[0])
      }
    } catch (err) {
      console.error('Failed to fetch docs:', err)
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const { data } = await axios.post(
        `${API_URL}/api/upload`,
        formData,
        {
          headers: {
            'x-owner-id': OWNER_ID,
          },
        }
      )

      const newDoc = {
        _id: data.documentId,
        originalName: data.filename,
        totalChunks: data.totalChunks,
      }

      setDocs(prev => [newDoc, ...prev])
      setActiveDoc(newDoc)
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Failed to upload PDF. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .app-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        @media (max-width: 768px) {
          .app-body {
            flex-direction: column;
            overflow: hidden;
          }

          .topbar {
            padding: 0 14px !important;
          }

          .tech-badge {
            font-size: 8px !important;
            padding: 3px 7px !important;
          }
        }
      `}</style>

      {/* Topbar */}
      <header
        className="topbar"
        style={{
          height: 52,
          background: 'var(--paper)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'inline-block',
            }}
          />

          DocChat
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {error && (
            <span
              style={{
                fontSize: 11,
                color: 'var(--danger)',
                background: 'var(--danger-bg)',
                padding: '3px 8px',
                borderRadius: 20,
              }}
            >
              {error}
            </span>
          )}

          <span
            className="tech-badge"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--sage)',
              background: 'var(--sage-bg)',
              border: '1px solid var(--sage-border)',
              borderRadius: 20,
              padding: '3px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--sage)',
                display: 'inline-block',
              }}
            />

            RAG · Groq · MongoDB
          </span>
        </div>
      </header>

      {/* Responsive Body */}
      <div className="app-body">
        <Sidebar
          docs={docs}
          activeDoc={activeDoc}
          onSelectDoc={setActiveDoc}
          onUpload={handleUpload}
          uploading={uploading}
        />

        <ChatArea activeDoc={activeDoc} />
      </div>
    </div>
  )
}
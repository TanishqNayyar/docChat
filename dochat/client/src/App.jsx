import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

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
      const { data } = await axios.get('/api/upload/list')
      setDocs(data)
      if (data.length > 0 && !activeDoc) setActiveDoc(data[0])
    } catch {
      console.error('Failed to fetch docs')
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('pdf', file)
    try {
      const { data } = await axios.post('/api/upload', formData)
      const newDoc = {
        _id: data.documentId,
        originalName: data.filename,
        totalChunks: data.totalChunks,
      }
      setDocs(prev => [newDoc, ...prev])
      setActiveDoc(newDoc)
    } catch {
      setError('Failed to upload PDF. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{
        height: 52,
        background: 'var(--paper)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 400,
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--gold)',
            display: 'inline-block',
          }} />
          DocChat
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {error && (
            <span style={{
              fontSize: 12,
              color: 'var(--danger)',
              background: 'var(--danger-bg)',
              padding: '3px 10px',
              borderRadius: 20,
            }}>{error}</span>
          )}
          <span style={{
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
          }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--sage)',
              display: 'inline-block',
            }} />
            RAG · Groq · MongoDB
          </span>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
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

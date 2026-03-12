import { useState, useEffect } from 'react'
import { DatasetLoader } from './components/DatasetLoader'
import { Navigation } from './components/Navigation'
import { Metadata } from './components/Metadata'
import { Conversation } from './components/Conversation'
import './index.css'

interface Sample {
  messages: Array<{
    role: string
    content?: string
    tool_calls?: any[]
    tool_call_id?: string
    name?: string
  }>
  [key: string]: any
}

function App() {
  const [totalCount, setTotalCount] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSample, setCurrentSample] = useState<Sample | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = (count: number) => {
    setTotalCount(count)
    setCurrentIndex(0)
    if (count > 0) {
      fetchSample(0)
    }
  }

  const fetchSample = async (index: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sample?id=${index}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to fetch sample')
      }

      const data = await response.json()
      setCurrentSample(data)
      setCurrentIndex(index)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sample')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigate = (index: number) => {
    fetchSample(index)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            JSONL Dataset Viewer
          </h1>
          <p className="text-gray-600 mt-2">
            Inspect LLM training datasets
          </p>
        </div>

        <DatasetLoader onLoad={handleLoad} />

        {totalCount > 0 && (
          <>
            <Navigation
              currentIndex={currentIndex}
              totalCount={totalCount}
              onNavigate={handleNavigate}
            />

            {loading && (
              <div className="text-center py-8 text-gray-600">
                Loading sample...
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {currentSample && !loading && (
              <>
                <Metadata sample={currentSample} />
                <Conversation messages={currentSample.messages} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App

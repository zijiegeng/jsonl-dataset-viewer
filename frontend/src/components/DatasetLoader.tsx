import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DatasetLoaderProps {
  onLoad: (count: number) => void
}

export function DatasetLoader({ onLoad }: DatasetLoaderProps) {
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPath(file.name)
    }
  }

  const handleLoad = async () => {
    if (!selectedFile && !path.trim()) {
      setError('Please enter a file path or choose a file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let response

      if (selectedFile) {
        // Upload file
        const formData = new FormData()
        formData.append('file', selectedFile)

        response = await fetch('/api/upload_dataset', {
          method: 'POST',
          body: formData,
        })
      } else {
        // Load from path
        response = await fetch('/api/load_dataset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path }),
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to load dataset')
      }

      const data = await response.json()
      onLoad(data.count)

      // Clear selected file after successful load
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dataset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter JSONL file path..."
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            disabled={loading}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".jsonl,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            variant="outline"
          >
            Choose File
          </Button>
          <Button onClick={handleLoad} disabled={loading}>
            {loading ? 'Loading...' : 'Load'}
          </Button>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
      </CardContent>
    </Card>
  )
}

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationProps {
  currentIndex: number
  totalCount: number
  onNavigate: (index: number) => void
}

export function Navigation({ currentIndex, totalCount, onNavigate }: NavigationProps) {
  const [jumpValue, setJumpValue] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1)
      } else if (e.key === 'ArrowRight' && currentIndex < totalCount - 1) {
        onNavigate(currentIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, totalCount, onNavigate])

  const handleJump = () => {
    const index = parseInt(jumpValue, 10)
    if (!isNaN(index) && index >= 0 && index < totalCount) {
      onNavigate(index)
      setJumpValue('')
    }
  }

  if (totalCount === 0) return null

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex >= totalCount - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm font-medium">
            Sample {currentIndex + 1} / {totalCount}
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Jump to..."
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJump()}
              className="w-32"
            />
            <Button variant="outline" onClick={handleJump}>
              Jump
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

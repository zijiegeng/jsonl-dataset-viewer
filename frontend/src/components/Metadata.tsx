import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface MetadataProps {
  sample: Record<string, any>
}

export function Metadata({ sample }: MetadataProps) {
  // Extract metadata fields (exclude messages)
  const metadataFields = Object.entries(sample).filter(
    ([key]) => key !== 'messages'
  )

  if (metadataFields.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metadataFields.map(([key, value]) => (
            <div key={key}>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {key}
              </div>
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

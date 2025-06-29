'use client'

import { CampsiteFormData } from '@/lib/validations/campsite'
import { useState } from 'react'

interface CampsiteTemplateProps {
  onTemplateSelect: (template: Partial<CampsiteFormData>) => void
}

const TEMPLATES = [
  {
    id: 'mountain',
    name: '山間部キャンプ場',
    template: {
      facilities: ['restroom', 'parking', 'shower'],
      activities: ['hiking', 'photography', 'stargazing'],
      access_time_ja: '徒歩20分',
      access_time_en: '20 min walk',
      description_ja: '自然豊かな山間部に位置するキャンプ場です。',
      description_en: 'A campsite located in a nature-rich mountainous area.',
    }
  },
  {
    id: 'lakeside',
    name: '湖畔キャンプ場',
    template: {
      facilities: ['restroom', 'parking', 'shower', 'bbq'],
      activities: ['fishing', 'boating', 'swimming'],
      access_time_ja: 'バス30分',
      access_time_en: '30 min by bus',
      description_ja: '美しい湖のほとりに位置するキャンプ場です。',
      description_en: 'A campsite located by a beautiful lake.',
    }
  },
  {
    id: 'forest',
    name: '森林キャンプ場',
    template: {
      facilities: ['restroom', 'parking', 'wifi'],
      activities: ['hiking', 'cycling', 'bird_watching'],
      access_time_ja: '徒歩15分',
      access_time_en: '15 min walk',
      description_ja: '深い森の中に位置する静かなキャンプ場です。',
      description_en: 'A quiet campsite located in a deep forest.',
    }
  },
  {
    id: 'beach',
    name: '海岸キャンプ場',
    template: {
      facilities: ['restroom', 'parking', 'shower', 'store'],
      activities: ['swimming', 'surfing', 'beach_volleyball'],
      access_time_ja: 'バス15分',
      access_time_en: '15 min by bus',
      description_ja: '美しい海岸線に位置するキャンプ場です。',
      description_en: 'A campsite located along a beautiful coastline.',
    }
  }
]

export default function CampsiteTemplate({ onTemplateSelect }: CampsiteTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template.template)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">テンプレートから選択</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedTemplate === template.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>設備: {template.template.facilities.length}種類</p>
              <p>アクティビティ: {template.template.activities.length}種類</p>
              <p className="truncate">{template.template.description_ja}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✓ テンプレートが適用されました。必要に応じて内容を調整してください。
          </p>
        </div>
      )}
    </div>
  )
}

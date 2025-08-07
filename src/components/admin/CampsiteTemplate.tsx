'use client'

import { CampsiteFormData } from '@/lib/validations/campsite'

interface CampsiteTemplateProps {
  onTemplateSelect: (template: Partial<CampsiteFormData>) => void
}

const TEMPLATES = [
  {
    name: '基本キャンプ場',
    data: {
      facilities: ['restroom', 'parking'],
      activities: ['hiking'],
      price: '2,000円/泊',
    }
  },
  {
    name: '高級リゾートキャンプ場',
    data: {
      facilities: ['restroom', 'shower', 'parking', 'wifi', 'kitchen'],
      activities: ['hiking', 'fishing', 'stargazing'],
      price: '8,000円/泊',
    }
  }
]

export default function CampsiteTemplate({ onTemplateSelect }: CampsiteTemplateProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">テンプレート選択</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateSelect(template.data)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
            <div className="text-sm text-gray-600">
              <p>設備: {template.data.facilities?.join(', ')}</p>
              <p>アクティビティ: {template.data.activities?.join(', ')}</p>
              <p>料金: {template.data.price}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

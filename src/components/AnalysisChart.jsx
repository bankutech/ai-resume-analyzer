import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const AnalysisChart = ({ scores }) => {
  if (!scores) {
    return (
      <div className="glass-strong rounded-3xl shadow-creative-lg p-8 border border-white/30">
        <h3 className="text-3xl font-display font-bold text-gray-800 mb-6">Performance Radar</h3>
        <div className="text-gray-500 text-center py-12 text-lg">No data available</div>
      </div>
    )
  }

  const data = [
    { subject: 'Completeness', value: scores.completeness || 0, fullMark: 100 },
    { subject: 'Content', value: scores.content_quality || 0, fullMark: 100 },
    { subject: 'Professional', value: scores.professionalism || 0, fullMark: 100 },
    { subject: 'Technical', value: scores.technical_depth || 0, fullMark: 100 },
    { subject: 'Creativity', value: scores.creativity || 0, fullMark: 100 },
  ]

  return (
    <div className="glass-strong rounded-3xl shadow-creative-lg p-8 border border-white/30 hover:shadow-glow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-3xl font-display font-bold text-gray-800">Performance Radar</h3>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#4B5563', fontSize: 14, fontWeight: 600 }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9CA3AF', fontSize: 11 }} 
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="url(#colorGradient)"
            fill="url(#colorGradient)"
            fillOpacity={0.7}
            strokeWidth={3}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisChart

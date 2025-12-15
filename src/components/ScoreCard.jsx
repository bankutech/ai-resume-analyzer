import React from 'react'

const ScoreCard = ({ title, score = 0, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
  }

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    pink: 'bg-pink-50',
    indigo: 'bg-indigo-50',
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    indigo: 'text-indigo-600',
  }

  const borderHoverClasses = {
    blue: 'hover:border-blue-300',
    green: 'hover:border-green-300',
    purple: 'hover:border-purple-300',
    orange: 'hover:border-orange-300',
    pink: 'hover:border-pink-300',
    indigo: 'hover:border-indigo-300',
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const gradientOverlayClass = `bg-gradient-to-br ${colorClasses[color]}`
  
  return (
    <div className={`glass-strong ${borderHoverClasses[color]} rounded-3xl shadow-creative-lg p-8 border-2 border-transparent hover:shadow-glow-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden`}>
      <div className={`absolute inset-0 ${gradientOverlayClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <div className={`text-5xl font-black ${getScoreColor(score)} drop-shadow-lg`}>
            {Math.round(score)}
          </div>
        </div>
        <h3 className="text-xl font-display font-bold text-gray-800 mb-4">{title}</h3>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`bg-gradient-to-r ${colorClasses[color]} h-3 rounded-full transition-all duration-700 shadow-md relative overflow-hidden`}
            style={{ width: `${Math.min(score, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard

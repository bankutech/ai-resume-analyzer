import React from 'react'
import { Sparkles, TrendingUp, Target, Award } from 'lucide-react'

const InsightsPanel = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Creative Insights</h3>
        <div className="text-gray-500 text-center py-8">No data available</div>
      </div>
    )
  }

  return (
    <div className="glass-strong rounded-3xl shadow-creative-lg p-8 border border-white/30 hover:shadow-glow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-3xl font-display font-bold text-gray-800">Creative Insights</h3>
      </div>
      
      <div className="space-y-8">
        {/* Personality Traits */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            Resume Personality
          </h4>
          <div className="flex flex-wrap gap-3">
            {analysis.personality_traits.map((trait, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Key Strengths
          </h4>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                <span className="text-2xl">✨</span>
                <span className="text-gray-800 font-medium">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Growth */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            Areas for Growth
          </h4>
          <ul className="space-y-3">
            {analysis.areas_for_growth.map((area, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-800 font-medium">{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Market Readiness */}
        <div className="pt-6 border-t-2 border-gray-200">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-800 text-lg">Market Readiness</span>
            <span className={`px-6 py-3 rounded-full font-bold text-base shadow-md ${
              analysis.creative_insights.market_readiness === 'High'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : analysis.creative_insights.market_readiness === 'Medium'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
            }`}>
              {analysis.creative_insights.market_readiness}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsPanel

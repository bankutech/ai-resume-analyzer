import React, { useState } from 'react'
import axios from 'axios'
import { Upload, Sparkles, TrendingUp, Award, Target, Lightbulb, BarChart3, User } from 'lucide-react'
import ScoreCard from './components/ScoreCard.jsx'
import AnalysisChart from './components/AnalysisChart.jsx'
import InsightsPanel from './components/InsightsPanel.jsx'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setAnalysis(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      })
      setAnalysis(response.data)
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please make sure the backend is running on port 5000.')
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Failed to analyze resume. Please try again.')
      }
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
              <Sparkles className="w-16 h-16 text-yellow-300 relative z-10 drop-shadow-2xl" />
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-black text-white drop-shadow-2xl bg-gradient-to-r from-white via-yellow-100 to-pink-100 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-white/95 font-medium mb-4 drop-shadow-lg">
            Transform Your Resume with AI-Powered Insights
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Get creative insights, personalized feedback, and professional recommendations to make your resume stand out
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-strong rounded-3xl shadow-creative-lg p-10 mb-12 animate-slide-in border border-white/20">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <label className="block text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Your Resume
                <span className="text-sm font-normal text-gray-500">(PDF, DOCX, or TXT)</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer group">
                  <div className="flex items-center justify-center w-full h-16 px-6 border-2 border-dashed border-primary-300 rounded-2xl hover:border-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-pink-50 transition-all duration-300 group-hover:shadow-creative">
                    <Upload className="w-6 h-6 text-primary-600 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-primary-700 font-semibold text-lg">
                      {file ? (
                        <span className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          {file.name}
                        </span>
                      ) : (
                        'Choose file or drag & drop'
                      )}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !file}
                  className="px-10 py-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-creative-lg hover:shadow-glow-lg hover:scale-105 flex items-center gap-3 text-lg transform active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Analyze Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl text-red-700 font-medium shadow-lg animate-slide-in">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-10 animate-fade-in">
            {/* Overall Score Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl shadow-creative-lg p-10 text-white animate-slide-in">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              ></div>
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
                <div>
                  <h2 className="text-4xl font-display font-black mb-3 drop-shadow-lg">Overall Resume Score</h2>
                  <p className="text-xl text-white/95 font-medium">Your resume is performing exceptionally well!</p>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl"></div>
                    <div className="relative text-8xl md:text-9xl font-black drop-shadow-2xl bg-gradient-to-br from-white to-yellow-100 bg-clip-text text-transparent">
                      {Math.round(analysis.scores.overall)}
                    </div>
                  </div>
                  <div className="text-xl text-white/90 font-semibold mt-2">out of 100</div>
                </div>
              </div>
            </div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ScoreCard
                title="Completeness"
                score={analysis.scores.completeness}
                icon={<Target className="w-6 h-6" />}
                color="blue"
              />
              <ScoreCard
                title="Content Quality"
                score={analysis.scores.content_quality}
                icon={<BarChart3 className="w-6 h-6" />}
                color="green"
              />
              <ScoreCard
                title="Professionalism"
                score={analysis.scores.professionalism}
                icon={<Award className="w-6 h-6" />}
                color="purple"
              />
              <ScoreCard
                title="Technical Depth"
                score={analysis.scores.technical_depth}
                icon={<TrendingUp className="w-6 h-6" />}
                color="orange"
              />
              <ScoreCard
                title="Creativity"
                score={analysis.scores.creativity}
                icon={<Lightbulb className="w-6 h-6" />}
                color="pink"
              />
              <ScoreCard
                title="Market Readiness"
                score={analysis.creative_insights.market_readiness === 'High' ? 85 : analysis.creative_insights.market_readiness === 'Medium' ? 65 : 45}
                icon={<User className="w-6 h-6" />}
                color="indigo"
              />
            </div>

            {/* Charts and Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <AnalysisChart scores={analysis.scores} />
              <InsightsPanel analysis={analysis} />
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Skills Section */}
              <div className="glass-strong rounded-3xl shadow-creative-lg p-8 border border-white/30 hover:shadow-glow-lg transition-all duration-300">
                <h3 className="text-3xl font-display font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  Skills Detected
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Technical Skills ({analysis.skills.technical.length})</h4>
                    <div className="flex flex-wrap gap-3">
                      {analysis.skills.technical.length > 0 ? (
                        analysis.skills.technical.map((skill, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">No technical skills detected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 text-lg">Soft Skills ({analysis.skills.soft.length})</h4>
                    <div className="flex flex-wrap gap-3">
                      {analysis.skills.soft.length > 0 ? (
                        analysis.skills.soft.map((skill, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">No soft skills detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="glass-strong rounded-3xl shadow-creative-lg p-8 border border-white/30 hover:shadow-glow-lg transition-all duration-300">
                <h3 className="text-3xl font-display font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  Resume Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <span className="text-gray-700 font-medium">Word Count</span>
                    <span className="font-bold text-gray-900 text-lg">{analysis.statistics.word_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <span className="text-gray-700 font-medium">Character Count</span>
                    <span className="font-bold text-gray-900 text-lg">{analysis.statistics.character_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <span className="text-gray-700 font-medium">Sections Found</span>
                    <span className="font-bold text-gray-900 text-lg">{analysis.statistics.sections_count}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 hover:shadow-md transition-all">
                    <span className="text-gray-700 font-medium">Career Level</span>
                    <span className="font-bold text-primary-700 text-lg">{analysis.career_level}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                    <span className="text-gray-700 font-medium">Resume Personality</span>
                    <span className="font-bold text-purple-700 text-lg">{analysis.creative_insights.resume_personality}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl shadow-creative-lg p-10 border-2 border-yellow-300/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-display font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  Improvement Suggestions
                </h3>
                <ul className="space-y-4">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200 border border-yellow-200/50">
                      <span className="text-2xl font-bold text-yellow-600 mt-0.5">💡</span>
                      <span className="text-gray-800 font-medium text-lg leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

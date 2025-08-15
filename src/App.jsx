import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Copy, Download, Plus, Trash2, FileText, List, Loader2, ExternalLink, MapPin, Lock, Zap, Shield, Target, MessageCircle, CheckCircle, Users, Brain, Search, TrendingUp, Eye, Cog, Award, Sun, Moon } from 'lucide-react'
import './App.css'

function App() {
  const [businessData, setBusinessData] = useState({
    latitude: '',
    longitude: '',
    location: '', // Country+State+City+ZipCode
    cid: ''
  })
  
  const [keywords, setKeywords] = useState([''])
  const [bulkKeywords, setBulkKeywords] = useState('')
  const [generatedLinks, setGeneratedLinks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const addKeyword = () => {
    setKeywords([...keywords, ''])
  }

  const removeKeyword = (index) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index))
    }
  }

  const updateKeyword = (index, value) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const processBulkKeywords = () => {
    if (!bulkKeywords.trim()) {
      alert('Please enter keywords in the bulk input area')
      return
    }

    const keywordList = bulkKeywords
      .split('\n')
      .map(k => k.trim())
      .filter(k => k !== '')

    if (keywordList.length === 0) {
      alert('No valid keywords found')
      return
    }

    setKeywords(keywordList)
    setBulkKeywords('')
    // Automatically generate permalinks after processing bulk keywords
    generatePermalinks(keywordList) 
  }

  const generatePermalinks = (currentKeywords = keywords) => {
    setIsLoading(true)
    if (!businessData.latitude || !businessData.longitude || !businessData.location || !businessData.cid) {
      alert('Please fill in all business information fields')
      setIsLoading(false)
      return
    }

    const validKeywords = currentKeywords.filter(k => k.trim() !== '')
    if (validKeywords.length === 0) {
      alert('Please add at least one keyword')
      setIsLoading(false)
      return
    }

    const links = validKeywords.map((keyword, index) => {
      const formattedKeyword = keyword.trim().replace(/\s+/g, '+')
      const permalink = `https://www.google.com/maps?ll${businessData.latitude},${businessData.longitude}&z=15&t=m&hl=en&geo=${businessData.location}&mapclient=embed&cid=${businessData.cid}&q=${formattedKeyword}`
      
      return {
        id: index + 1,
        keyword: keyword.trim(),
        formattedKeyword,
        permalink
      }
    })

    setGeneratedLinks(links)
    setIsLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const downloadCSV = () => {
    if (generatedLinks.length === 0) {
      alert('No links to download. Generate permalinks first.')
      return
    }

    const headers = ['S.no', 'Google Map', 'Latitude', 'comma', 'Longitude', 'Dont Change this', 'Country+State+City+ZipCode', 'Dont Change this', 'CID', 'And', 'Query', 'Keyword', 'Permalink', 'Original Permalink']
    
    const rows = generatedLinks.map(link => [
      link.id,
      'https://www.google.com/maps?ll',
      businessData.latitude,
      ',',
      businessData.longitude,
      '&z=15&t=m&hl=en&geo=',
      businessData.location,
      '&mapclient=embed&cid=',
      businessData.cid,
      '&',
      'q=',
      link.formattedKeyword,
      link.permalink,
      link.permalink
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'google_maps_permalinks.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const themeClasses = {
    background: isDarkMode 
      ? "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" 
      : "min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50",
    text: {
      primary: isDarkMode ? "text-white" : "text-gray-900",
      secondary: isDarkMode ? "text-gray-300" : "text-gray-600",
      accent: isDarkMode ? "text-purple-200" : "text-purple-700",
      muted: isDarkMode ? "text-gray-400" : "text-gray-500"
    },
    card: {
      base: isDarkMode ? "bg-slate-800/70" : "bg-white/80",
      border: isDarkMode ? "border-purple-500/30" : "border-purple-300/50"
    },
    input: {
      base: isDarkMode ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500",
      label: isDarkMode ? "text-gray-300" : "text-gray-700"
    },
    button: {
      outline: isDarkMode ? "border-slate-600 hover:bg-slate-700" : "border-gray-300 hover:bg-gray-100"
    }
  }

  return (
    <div className={themeClasses.background}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`${isDarkMode ? 'border-slate-600 hover:bg-slate-700 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'} backdrop-blur-sm`}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Lock className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${themeClasses.text.primary}`}>
              ContentScale
            </h1>
          </div>
          <p className={`text-xl ${themeClasses.text.accent} mb-4`}>
            The <strong className={isDarkMode ? "text-purple-300" : "text-purple-800"}>Private</strong> AI Content Platform That Dominates Google AI Overview
          </p>
          <p className={`text-lg ${themeClasses.text.secondary} mb-6`}>
            Powered by Sofeia AI | Human Content Editors + Autonomous Ranking AI
          </p>
          
          <div className={`${isDarkMode ? 'bg-red-900/30 border-red-500 text-red-200' : 'bg-red-100/80 border-red-400 text-red-800'} border px-6 py-4 rounded-lg inline-block mb-6`}>
            <strong>🚀 Why we went private:</strong> Our autonomous ranking AI was so effective that malicious actors attempted to exploit it. Now, access is <strong>exclusive</strong> to verified partners.
          </div>

          <a 
            href="https://wa.me/31628073996" 
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Ottmar via WhatsApp (+31 628073996)
          </a>
        </div>

        {/* Why Fortune 500 Companies Switched */}
        <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-yellow-500/50' : 'border-yellow-400/50'} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20' : 'bg-gradient-to-r from-yellow-200/50 to-orange-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary} text-xl`}>
              <Award className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              Why Fortune 500 Companies Switched to Our Private Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className={`grid md:grid-cols-3 gap-6 ${themeClasses.text.secondary}`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-2`}>14,329</div>
                <div className="text-sm">Top 3 Rankings Generated</div>
                <div className={`text-xs ${themeClasses.text.muted}`}>2023-2024 Public Beta</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>83%</div>
                <div className="text-sm">Client Retention Rate</div>
                <div className={`text-xs ${themeClasses.text.muted}`}>Current Private Access</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mb-2`}>4.7</div>
                <div className="text-sm">Average Position Improvement</div>
                <div className={`text-xs ${themeClasses.text.muted}`}>Source: BLS 2025 Tech Report</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Our System Works */}
        <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-blue-500/50' : 'border-blue-400/50'} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20' : 'bg-gradient-to-r from-blue-200/50 to-cyan-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary} text-xl`}>
              <Cog className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              How Our Autonomous Ranking AI + Human Editors Work
            </CardTitle>
            <CardDescription className={themeClasses.text.secondary}>
              The perfect combination of AI efficiency and human expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                  <Brain className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  AI Technology Stack
                </h4>
                <div className={`space-y-3 ${themeClasses.text.secondary}`}>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>Live SERP Scraping:</strong> Analyzes top 10 every 72 hours
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-green-400' : 'bg-green-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>NLP Semantic Mapping:</strong> Extracts 300+ related terms
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-yellow-400' : 'bg-yellow-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>Schema Markup:</strong> Auto-generates structured data
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                  <Users className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  Human Content Editors
                </h4>
                <div className={`space-y-3 ${themeClasses.text.secondary}`}>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>Expert Review:</strong> Every piece reviewed by industry specialists
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-orange-400' : 'bg-orange-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>E-E-A-T Optimization:</strong> Manual authority and expertise enhancement
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-red-400' : 'bg-red-600'} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <strong>Quality Assurance:</strong> Human fact-checking and source verification
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Search Dominance */}
        <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-green-500/50' : 'border-green-400/50'} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20' : 'bg-gradient-to-r from-green-200/50 to-emerald-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary} text-xl`}>
              <Search className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              Why ContentScale Dominates All Search Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50/80'} p-6 rounded-lg border ${isDarkMode ? 'border-blue-500/30' : 'border-blue-300/50'}`}>
                <div className="flex items-center mb-4">
                  <Eye className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Google AI Overview</h4>
                </div>
                <ul className={`space-y-2 ${themeClasses.text.secondary} text-sm`}>
                  <li>• Definition box triggers in first 100 words</li>
                  <li>• Step-by-step modules with schema markup</li>
                  <li>• Comparative tables with structured data</li>
                  <li>• 68% higher featured snippet chances</li>
                </ul>
              </div>
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50/80'} p-6 rounded-lg border ${isDarkMode ? 'border-purple-500/30' : 'border-purple-300/50'}`}>
                <div className="flex items-center mb-4">
                  <Brain className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>AI Search Engines</h4>
                </div>
                <ul className={`space-y-2 ${themeClasses.text.secondary} text-sm`}>
                  <li>• Semantic keyword clustering</li>
                  <li>• Context-aware content structure</li>
                  <li>• Natural language optimization</li>
                  <li>• AI-friendly formatting patterns</li>
                </ul>
              </div>
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50/80'} p-6 rounded-lg border ${isDarkMode ? 'border-yellow-500/30' : 'border-yellow-300/50'}`}>
                <div className="flex items-center mb-4">
                  <TrendingUp className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mr-3`} />
                  <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Traditional Search</h4>
                </div>
                <ul className={`space-y-2 ${themeClasses.text.secondary} text-sm`}>
                  <li>• 2,750+ word comprehensive coverage</li>
                  <li>• 3-5 .gov/.edu authoritative links</li>
                  <li>• Technical SEO optimization</li>
                  <li>• RankMath 100-point compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* C.R.A.F.T Framework */}
        <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-orange-500/50' : 'border-orange-400/50'} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20' : 'bg-gradient-to-r from-orange-200/50 to-red-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary} text-xl`}>
              <Target className={`h-6 w-6 mr-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              C.R.A.F.T Framework Implementation
            </CardTitle>
            <CardDescription className={themeClasses.text.secondary}>
              Our proprietary content optimization methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/50'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-bold text-lg`}>C</span>
                </div>
                <h4 className={`${themeClasses.text.primary} font-semibold mb-2`}>Cut the Fluff</h4>
                <p className={`${themeClasses.text.secondary} text-sm`}>Removes 19% more filler content through neural network analysis</p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-600/20' : 'bg-green-200/50'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-bold text-lg`}>R</span>
                </div>
                <h4 className={`${themeClasses.text.primary} font-semibold mb-2`}>Review & Optimize</h4>
                <p className={`${themeClasses.text.secondary} text-sm`}>Auto-checks against RankMath's 100-point checklist</p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-200/50'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} font-bold text-lg`}>A</span>
                </div>
                <h4 className={`${themeClasses.text.primary} font-semibold mb-2`}>Add Visuals</h4>
                <p className={`${themeClasses.text.secondary} text-sm`}>Generates interactive HTML tables with real-time data</p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-200/50'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className={`${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} font-bold text-lg`}>F</span>
                </div>
                <h4 className={`${themeClasses.text.primary} font-semibold mb-2`}>Fact-Check</h4>
                <p className={`${themeClasses.text.secondary} text-sm`}>Human editors verify all claims with authoritative sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-lg`}>
            <CardHeader className="text-center">
              <Zap className={`h-8 w-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mx-auto mb-2`} />
              <CardTitle className={themeClasses.text.primary}>DR 98 Authority</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text.secondary} text-sm`}>Autonomous ranking AI with structured data + authoritative sourcing</p>
            </CardContent>
          </Card>

          <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-lg`}>
            <CardHeader className="text-center">
              <Target className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'} mx-auto mb-2`} />
              <CardTitle className={themeClasses.text.primary}>14,000+ Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text.secondary} text-sm`}>Public beta generated top 3 rankings before going private</p>
            </CardContent>
          </Card>

          <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-lg`}>
            <CardHeader className="text-center">
              <Shield className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-2`} />
              <CardTitle className={themeClasses.text.primary}>AI Overview Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text.secondary} text-sm`}>Tests content against AI Overview triggers before publishing</p>
            </CardContent>
          </Card>

          <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-lg`}>
            <CardHeader className="text-center">
              <Lock className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mx-auto mb-2`} />
              <CardTitle className={themeClasses.text.primary}>Invite-Only Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text.secondary} text-sm`}>API key authentication with NDA and anti-spam compliance</p>
            </CardContent>
          </Card>
        </div>

        {/* Exclusive Tool Section */}
        <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-purple-500/50' : 'border-purple-400/50'} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20' : 'bg-gradient-to-r from-purple-200/50 to-blue-200/50'}`}>
            <div className="flex items-center justify-center mb-4">
              <MapPin className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
              <CardTitle className={`text-2xl ${themeClasses.text.primary}`}>Exclusive: DR 98 Google Maps Permalink Generator</CardTitle>
            </div>
            <CardDescription className={`text-center ${themeClasses.text.accent}`}>
              Available only to ContentScale partners. Generate high-authority Google Maps permalinks for content writers and SEO professionals.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Business Information Card */}
        <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-200/50 to-purple-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary}`}>
              <MapPin className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Business Information
            </CardTitle>
            <CardDescription className={themeClasses.text.secondary}>
              Enter the core information for your business location.
              <div className="mt-2 space-x-4">
                <a 
                  href="https://gps-coordinates.org/coordinate-converter.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Find Coordinates
                </a>
                <a 
                  href="https://cidfinder.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Find CID
                </a>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="latitude" className={`text-sm font-medium ${themeClasses.input.label}`}>Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="e.g., 36.1565792"
                  value={businessData.latitude}
                  onChange={(e) => setBusinessData({...businessData, latitude: e.target.value})}
                  className={`mt-1 ${themeClasses.input.base}`}
                />
              </div>
              <div>
                <Label htmlFor="longitude" className={`text-sm font-medium ${themeClasses.input.label}`}>Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="e.g., -86.7812687"
                  value={businessData.longitude}
                  onChange={(e) => setBusinessData({...businessData, longitude: e.target.value})}
                  className={`mt-1 ${themeClasses.input.base}`}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location" className={`text-sm font-medium ${themeClasses.input.label}`}>Location (Country+State+City+ZipCode)</Label>
              <Input
                id="location"
                placeholder="e.g., US-TN-Nashville-37203"
                value={businessData.location}
                onChange={(e) => setBusinessData({...businessData, location: e.target.value})}
                className={`mt-1 ${themeClasses.input.base}`}
              />
            </div>
            <div>
              <Label htmlFor="cid" className={`text-sm font-medium ${themeClasses.input.label}`}>Google Customer ID (CID)</Label>
              <Input
                id="cid"
                placeholder="e.g., 7464809096879172793"
                value={businessData.cid}
                onChange={(e) => setBusinessData({...businessData, cid: e.target.value})}
                className={`mt-1 ${themeClasses.input.base}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Keywords Card */}
        <Card className={`${themeClasses.card.base} ${themeClasses.card.border} shadow-2xl mb-8`}>
          <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-green-600/20 to-purple-600/20' : 'bg-gradient-to-r from-green-200/50 to-purple-200/50'}`}>
            <CardTitle className={`flex items-center ${themeClasses.text.primary}`}>
              <FileText className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              Keywords for DR 98 Permalinks
            </CardTitle>
            <CardDescription className={themeClasses.text.secondary}>Add keywords that will be used to generate high-authority permalinks</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 mb-6 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <TabsTrigger value="individual" className={`flex items-center gap-2 ${isDarkMode ? 'data-[state=active]:bg-purple-600' : 'data-[state=active]:bg-purple-500 data-[state=active]:text-white'}`}>
                  <List className="h-4 w-4" />
                  Individual Keywords
                </TabsTrigger>
                <TabsTrigger value="bulk" className={`flex items-center gap-2 ${isDarkMode ? 'data-[state=active]:bg-purple-600' : 'data-[state=active]:bg-purple-500 data-[state=active]:text-white'}`}>
                  <FileText className="h-4 w-4" />
                  Bulk Input
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual" className="space-y-4">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Keyword ${index + 1} (e.g., content writing services)`}
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      className={`flex-1 ${themeClasses.input.base}`}
                    />
                    {keywords.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeKeyword(index)}
                        className={`shrink-0 ${themeClasses.button.outline}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addKeyword} className={`w-full ${themeClasses.button.outline}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Keyword
                </Button>
              </TabsContent>
              
              <TabsContent value="bulk" className="space-y-4">
                <div>
                  <Label htmlFor="bulk-keywords" className={`text-sm font-medium ${themeClasses.input.label}`}>Bulk Keywords (one per line)</Label>
                  <Textarea
                    id="bulk-keywords"
                    placeholder={`content writing services\nSEO content creation\ncopywriting agency\nblog writing services\ntechnical writing`}
                    value={bulkKeywords}
                    onChange={(e) => setBulkKeywords(e.target.value)}
                    rows={8}
                    className={`mt-2 ${themeClasses.input.base}`}
                  />
                </div>
                <Button onClick={processBulkKeywords} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Process Bulk Keywords
                </Button>
                {keywords.length > 1 && (
                  <div className={`text-sm ${themeClasses.text.secondary} ${isDarkMode ? 'bg-purple-900/30 border-purple-500/30' : 'bg-purple-100/50 border-purple-300/50'} p-3 rounded-lg border`}>
                    <CheckCircle className={`h-4 w-4 inline mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    Current keywords loaded: {keywords.filter(k => k.trim() !== '').length}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => generatePermalinks()} 
            className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Generating DR 98 Permalinks...' : 'Generate DR 98 Permalinks'}
          </Button>
          {generatedLinks.length > 0 && (
            <Button variant="outline" onClick={downloadCSV} className={`h-12 ${themeClasses.button.outline}`}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          )}
        </div>

        {/* Results */}
        {generatedLinks.length > 0 && (
          <Card className={`${themeClasses.card.base} ${isDarkMode ? 'border-green-500/50' : 'border-green-400/50'} shadow-2xl mb-8`}>
            <CardHeader className={`${isDarkMode ? 'bg-gradient-to-r from-green-600/20 to-purple-600/20' : 'bg-gradient-to-r from-green-200/50 to-purple-200/50'}`}>
              <CardTitle className={`flex items-center ${themeClasses.text.primary}`}>
                <Copy className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                Generated DR 98 Permalinks ({generatedLinks.length})
              </CardTitle>
              <CardDescription className={themeClasses.text.secondary}>High-authority Google Maps permalinks ready for content integration</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {generatedLinks.map((link) => (
                  <div key={link.id} className={`border ${isDarkMode ? 'border-slate-600 bg-slate-700/30 hover:bg-slate-700/50' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'} rounded-lg p-4 transition-colors`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-medium text-sm ${themeClasses.text.secondary} ${isDarkMode ? 'bg-purple-600/30 border-purple-500/50' : 'bg-purple-200/50 border-purple-300/50'} px-3 py-1 rounded-full border`}>
                        #{link.id} - {link.keyword}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.permalink)}
                        className={`${isDarkMode ? 'hover:bg-green-600/20 border-green-500/50' : 'hover:bg-green-100 border-green-400'}`}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-200 bg-slate-900/50 border-slate-600' : 'text-gray-800 bg-white/70 border-gray-300'} break-all font-mono p-3 rounded border`}>
                      {link.permalink}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer CTA */}
        <div className={`text-center py-12 mt-12 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-300'}`}>
          <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mb-4`}>Ready for ContentScale Access?</h3>
          <p className={`${themeClasses.text.secondary} mb-6 max-w-2xl mx-auto`}>
            This permalink generator is just one tool in our comprehensive AI content platform. 
            Get exclusive access to our full suite of ranking tools with human content editors.
          </p>
          <div className="space-y-4">
            <a 
              href="https://wa.me/31628073996" 
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              Apply for Exclusive Access
            </a>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              Minimum €500/month | NDA Required | Verified Partners Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


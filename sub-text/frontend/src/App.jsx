import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import UploadZone from './components/UploadZone'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import { AnimatePresence } from 'framer-motion'

function App() {
  const [report, setReport] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleUpload = (data, file) => {
    setReport(data)
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
    }
    navigate('/dashboard')
  }

  // Persistence Logic
  useEffect(() => {
    const savedReport = sessionStorage.getItem("analysis_report");
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
        // If we have a report, go to dashboard (File will be missing, but that's okay)
        if (location.pathname === '/') navigate('/dashboard');
      } catch (e) {
        console.error("Failed to parse saved report", e);
      }
    }
  }, []);

  useEffect(() => {
    if (report) {
      sessionStorage.setItem("analysis_report", JSON.stringify(report));
    }
  }, [report]);

  // Handle File Cleanup
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl)
    }
  }, [fileUrl])

  return (
    <div className="min-h-screen font-sans bg-paper text-ink">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<LandingPage />} />

          <Route path="/upload" element={
            <div className="min-h-screen flex flex-col">
              <nav className="p-6 flex justify-between items-center bg-paper border-b-3 border-ink w-full relative z-10 shadow-sm">
                <div className="font-black text-xl cursor-pointer select-none" onClick={() => navigate('/')}>SUBTEXT</div>
                <div className="font-mono text-sm underline decoration-wavy">UPLOAD_MODE</div>
              </nav>
              <main className="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] relative z-0">
                <UploadZone onUpload={handleUpload} />
              </main>
            </div>
          } />

          <Route path="/dashboard" element={
            <Dashboard
              report={report}
              fileUrl={fileUrl}
              onReset={() => {
                setReport(null)
                setFileUrl(null)
                navigate('/upload')
              }}
            />
          } />

        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App

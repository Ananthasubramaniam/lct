import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            SITCode
          </h1>
          <p className="text-gray-400 mb-8">College LeetCode Tracker</p>

          <div className="space-y-4 text-left">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <p className="text-sm font-semibold text-emerald-400">Phase 1 Status</p>
              <p className="text-sm text-gray-300">Frontend: React + Vite + Tailwind</p>
              <p className="text-sm text-gray-300">Backend: Node.js + Express</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

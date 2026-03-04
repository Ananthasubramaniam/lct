import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Sync() {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleSync = async (e) => {
        e.preventDefault()

        if (!username.trim()) {
            setError('Please enter a LeetCode username')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // 1. Get current logged-in user
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError || !session) {
                throw new Error('You must be logged in to sync data')
            }

            // 2. Call backend sync endpoint
            const response = await fetch(`http://localhost:5000/api/sync/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: session.user.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sync LeetCode data')
            }

            // 3. Display success
            setResult(data)
            setUsername('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-lg p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        Sync LeetCode Data
                    </h1>
                    <p className="text-gray-400">
                        Link your LeetCode account to automatically import your recent submissions.
                    </p>
                </div>

                <form onSubmit={handleSync} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                            LeetCode Username
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. neetcode"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg outline-none bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all
              ${loading
                                ? 'bg-emerald-600/50 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Syncing your progress...
                            </span>
                        ) : (
                            'Sync Now'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex gap-3 text-red-200">
                        <svg className="h-5 w-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-6 p-4 rounded-lg bg-emerald-900/30 border border-emerald-500/50 flex flex-col items-center gap-3 text-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1">
                            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-semibold text-lg text-emerald-400 text-center">
                            {result.syncedCount} problems synced successfully!
                        </p>
                        {result.syncedCount === 0 && (
                            <p className="text-sm text-gray-400 text-center">We couldn't find any recent accepted submissions in your public profile.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

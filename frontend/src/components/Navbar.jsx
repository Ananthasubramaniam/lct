import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar({ session }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex">
                        <Link to="/leaderboard" className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                                SITCode
                            </span>
                        </Link>

                        {session && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to="/leaderboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-colors">
                                    Leaderboard
                                </Link>
                                <Link to="/problems" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-colors">
                                    My Problems
                                </Link>
                                <Link to="/sync" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-emerald-500 transition-colors">
                                    Sync
                                </Link>
                            </div>
                        )}
                    </div>

                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block">
                                {session.user.user_metadata?.full_name || session.user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-md hover:bg-gray-800"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                                Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

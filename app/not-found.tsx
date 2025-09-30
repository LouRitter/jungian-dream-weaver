import Link from 'next/link'
import Logo from './components/ui/logo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <Logo size="xl" variant="hero" />
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gray-300">Page Not Found</h1>
          <p className="text-gray-400">The page you're looking for doesn't exist.</p>
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔗 Dynamic QR Code Platform
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Counter</h2>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Count: {count}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">✅ Status Check</h3>
          <ul className="mt-2 text-blue-800 text-sm space-y-1">
            <li>✅ React is working</li>
            <li>✅ Tailwind CSS is loaded</li>
            <li>✅ Frontend is running on http://localhost:5174</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
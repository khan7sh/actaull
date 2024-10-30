import React from 'react'

const BuildInfo = () => {
  return (
    <div className="fixed bottom-4 right-4 text-xs text-gray-500">
      Build: {new Date().toISOString()}
    </div>
  )
}

export default BuildInfo 
import React, { useEffect } from 'react'
import Viewer from './Viewer'

// Demo component that wraps Viewer for demo purposes
export default function Demo() {
  useEffect(() => {
    // Auto-show info overlay after component mounts
    const timer = setTimeout(() => {
      // Find and click the "Show Details" button
      const showDetailsBtn = document.querySelector('[data-show-details="true"]')
      if (showDetailsBtn) {
        showDetailsBtn.click()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <Viewer />
}
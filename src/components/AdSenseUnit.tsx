import { useEffect, useRef } from 'react'

const AD_CLIENT = 'ca-pub-4605993190727004'
const AD_SLOT = '5732399597'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdSenseUnit() {
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!insRef.current || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense may not be loaded yet
    }
  }, [])

  return (
    <div className="ad-unit ad-unit--read" aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

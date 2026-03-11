import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (options: {
          objectType: string
          content: {
            title: string
            description: string
            imageUrl: string
            link: {
              mobileWebUrl: string
              webUrl: string
            }
          }
          buttons?: Array<{
            title: string
            link: {
              mobileWebUrl: string
              webUrl: string
            }
          }>
        }) => void
      }
    }
  }
}

interface KakaoShareButtonProps {
  title?: string
  description?: string
  imageUrl?: string
  url?: string
  disabled?: boolean
}

export function KakaoShareButton({
  title = 'Shofar AI · 성경 읽기 스케줄러',
  description = '팀별 성경 읽기 순서를 만들고 메시지용 텍스트를 복사하세요',
  imageUrl = `${window.location.origin}/logo.png`,
  url = window.location.href,
  disabled = false
}: KakaoShareButtonProps) {
  const { t } = useI18n()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY
    
    if (!kakaoKey) {
      console.warn('Kakao JavaScript Key is not configured')
      return
    }

    // Wait for Kakao SDK to load
    const checkKakao = setInterval(() => {
      if (window.Kakao) {
        clearInterval(checkKakao)
        
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoKey)
        }
        
        setIsReady(true)
      }
    }, 100)

    return () => clearInterval(checkKakao)
  }, [])

  const handleShare = () => {
    if (!window.Kakao || !isReady) {
      alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    if (disabled) {
      alert('먼저 "전체 복사" 버튼을 클릭하여 스케줄을 복사해주세요.')
      return
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl: url,
          webUrl: url
        }
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: url,
            webUrl: url
          }
        }
      ]
    })
  }

  if (!import.meta.env.VITE_KAKAO_JS_KEY) {
    return null
  }

  return (
    <button
      onClick={handleShare}
      disabled={!isReady || disabled}
      className="kakao-share-button"
      aria-label="카카오톡으로 공유하기"
      title={disabled ? '먼저 스케줄을 복사해주세요' : '카카오톡으로 공유하기'}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.477 0 0 3.582 0 8c0 2.891 1.889 5.433 4.733 6.867-.2.733-.667 2.5-.767 2.9-.133.533.2.533.433.4.2-.133 2.867-1.933 3.334-2.267.4.067.8.1 1.267.1 5.523 0 10-3.582 10-8s-4.477-8-10-8z" fill="currentColor"/>
      </svg>
      <span>{t('share.kakao') || '카카오톡 공유'}</span>
    </button>
  )
}

import { useState, useEffect, useRef } from 'react'

export const useIdleTimer = (timeout: number, onIdle: () => void) => {
    const [isIdle, setIsIdle] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            setIsIdle(false)
            timerRef.current = setTimeout(() => {
                setIsIdle(true)
                onIdle()
            }, timeout)
        }
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']
        events.forEach(event => window.addEventListener(event, resetTimer))
        resetTimer()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            events.forEach(event => window.removeEventListener(event, resetTimer))
        }
    }, [onIdle, timeout])

    return isIdle
}

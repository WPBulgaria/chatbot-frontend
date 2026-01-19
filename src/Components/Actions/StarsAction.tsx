import { useState } from 'react'
import { useBotUI, useBotUIAction } from '@botui/react'

export const StarsAction = () => {
  const bot = useBotUI()
  const action = useBotUIAction()
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const total = action?.data?.total || 5
  const stars = [...Array(total).keys()]

  const handleStarClick = (index: number) => {
    bot.next({ starsGiven: index + 1 }, { messageType: 'stars' })
  }

  const handleMouseEnter = (index: number) => {
    setHoveredStar(index)
  }

  const handleMouseLeave = () => {
    setHoveredStar(null)
  }

  const isHighlighted = (index: number) => hoveredStar !== null && index <= hoveredStar

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {stars.map((i) => (
        <button
          key={i}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 border shadow-sm hover:shadow-md active:scale-95 ${
            isHighlighted(i) 
              ? 'scale-110 bg-[#00BFA5]/15 border-[#00BFA5]' 
              : 'bg-white border-[#e2e8f0] hover:border-[#00BFA5]/50'
          }`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {isHighlighted(i) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

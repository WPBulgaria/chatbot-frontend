interface StarsMessageProps {
  message: {
    data: {
      starsGiven: number
    }
  }
}

export const StarsMessage = ({ message }: StarsMessageProps) => {
  const starsGiven = message.data.starsGiven
  const totalStars = 5
  const stars = [...Array(totalStars).keys()]

  return (
    <div className="text-2xl tracking-wide">
      {stars.map((i) => (
        <span key={i} className={i < starsGiven ? 'opacity-100' : 'opacity-30'}>
          ⭐
        </span>
      ))}
    </div>
  )
}

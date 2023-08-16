import React from 'react'

interface ButtonProps {
  label: string,
  text: string,
  onClick: () => void,
}

const Button = ({
  label,
}: ButtonProps) => {
  return (
    <div>
      <button>
        {label}
      </button>
    </div>
  )
}

export default Button

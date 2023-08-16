import React from 'react'

interface TitleProps {
  className: string
  children: string
}

const Title = ({
  children,
}: TitleProps) => {
  return (
    <div className={''}>
      {children}
    </div>
  )
}

export default Title

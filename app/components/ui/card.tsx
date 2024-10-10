import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={`px-4 py-5 border-b border-gray-200 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <h3 className={`text-lg font-medium leading-6 text-gray-900 ${className}`}>{children}</h3>
}
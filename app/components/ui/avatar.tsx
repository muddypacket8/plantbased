import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export function Avatar({ src, alt, fallback, className = '' }: AvatarProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </div>
  )
}

interface AvatarImageProps {
  src: string
  alt?: string
}

export function AvatarImage({ src, alt }: AvatarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover rounded-full"
    />
  )
}

interface AvatarFallbackProps {
  children: React.ReactNode
}

export function AvatarFallback({ children }: AvatarFallbackProps) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600">
      {children}
    </div>
  )
}
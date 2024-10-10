import React, { createContext, useContext, InputHTMLAttributes } from 'react'

interface RadioGroupContextType {
  name: string
  value: string
  onChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined)

interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

export function RadioGroup({ name, value, onChange, children }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div className="space-y-2">{children}</div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
}

export function RadioGroupItem({ value, className = '', ...props }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext)
  if (!context) throw new Error('RadioGroupItem must be used within a RadioGroup')

  return (
    <input
      type="radio"
      className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      name={context.name}
      checked={context.value === value}
      onChange={() => context.onChange(value)}
      value={value}
      {...props}
    />
  )
}
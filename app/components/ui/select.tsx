import React, { SelectHTMLAttributes, createContext, useContext } from 'react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children, ...props }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <select
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        {...props}
      >
        {children}
      </select>
    </SelectContext.Provider>
  )
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return <option {...props}>{children}</option>
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within a Select')
  return <>{context.value || placeholder}</>
}
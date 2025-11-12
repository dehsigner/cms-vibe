"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentProps<"input"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({
  className,
  checked,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }

  return (
    <label
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-primary" : "bg-input",
        className
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        {...props}
      />
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          isChecked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </label>
  )
}

export { Switch }


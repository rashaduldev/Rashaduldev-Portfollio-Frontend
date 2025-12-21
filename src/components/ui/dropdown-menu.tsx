/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useRef, useEffect } from "react"
import { CheckIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  id: string
  openDropdownId: string | null
  setOpenDropdownId: (id: string | null) => void
  children: React.ReactNode
  className?: string
}

interface TriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function DropdownMenu({
  id,
  openDropdownId,
  setOpenDropdownId,
  children,
  className,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isOpen = openDropdownId === id

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, setOpenDropdownId])

  const toggle = () => {
    setOpenDropdownId(isOpen ? null : id)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        if (child.type === DropdownMenuTrigger) {
          const childProps = child.props as TriggerProps & {
            onClick?: (e: React.MouseEvent<HTMLElement>) => void
          }
          if (childProps.asChild) {
            return React.Children.map(childProps.children, (innerChild) => {
              if (!React.isValidElement(innerChild)) return innerChild

              const originalOnClick = (innerChild.props as any).onClick

              return React.cloneElement(innerChild as React.ReactElement<any>, {
                onClick: (e: React.MouseEvent<HTMLElement>) => {
                  originalOnClick?.(e)
                  toggle()
                },
              })
            })
          }
          const originalOnClick = childProps.onClick

          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              originalOnClick?.(e)
              toggle()
            },
          })
        }
        if ((child.type as any).displayName === "DropdownMenuContent") {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            className,
          })
        }

        return child
      })}
    </div>
  )
}

/* ================= Trigger ================= */

export function DropdownMenuTrigger({
  children,
  className,
  asChild = false,
  ...props
}: TriggerProps & React.HTMLAttributes<HTMLDivElement>) {
  if (asChild) {
    return <>{children}</>
  }

  return (
    <div
      {...props}
      className={cn(
        "cursor-pointer select-none flex items-center gap-1",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ================= Content ================= */

function DropdownMenuContentComponent({
  children,
  isOpen = false,
  className,
}: {
  children: React.ReactNode
  isOpen?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "absolute left-0 md:left-auto md:right-0 mt-2 w-56 max-w-[90vw] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 transform origin-top-right transition-all duration-200 z-50",
        isOpen
          ? "opacity-100 scale-100 visible"
          : "opacity-0 scale-95 pointer-events-none invisible",
        className
      )}
    >
      {children}
    </div>
  )
}

DropdownMenuContentComponent.displayName = "DropdownMenuContent"

export const DropdownMenuContent = DropdownMenuContentComponent

/* ================= Items ================= */

export function DropdownMenuItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm rounded flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onChange,
}: {
  children: React.ReactNode
  checked?: boolean
  onChange?: () => void
}) {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      {checked && <CheckIcon className="w-4 h-4" />}
      {children}
    </div>
  )
}

export function DropdownMenuRadioGroup({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col">{children}</div>
}

export function DropdownMenuRadioItem({
  children,
  selected,
  onSelect,
}: {
  children: React.ReactNode
  selected?: boolean
  onSelect?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      {selected && <CircleIcon className="w-3 h-3" />}
      {children}
    </div>
  )
}

export function DropdownMenuLabel({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="px-3 py-1 text-xs text-gray-500">{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="border-t my-1 border-gray-200 dark:border-gray-700" />
}
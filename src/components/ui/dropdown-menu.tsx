"use client"

import React, { useState, useRef, useEffect } from "react"
import { CheckIcon, CircleIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------- Dropdown Components ----------------
interface DropdownProps {
  id: string
  openDropdownId: string | null
  setOpenDropdownId: (id: string | null) => void
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ id, openDropdownId, setOpenDropdownId, trigger, children, className }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isOpen = openDropdownId === id

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) setOpenDropdownId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setOpenDropdownId])

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setOpenDropdownId(isOpen ? null : id)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {/* Dropdown content */}
      <div
        className={cn(
          "absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 p-2 transform origin-top-right transition-all duration-200",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

// ---------------- Individual Items ----------------
export function DropdownMenuItem({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={cn("cursor-pointer px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-500 flex items-center", className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function DropdownMenuCheckboxItem({ children, checked, onChange }: { children: React.ReactNode; checked?: boolean; onChange?: () => void }) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm rounded hover:bg-gray-100"
      onClick={onChange}
    >
      {checked && <CheckIcon className="w-4 h-4" />}
      {children}
    </div>
  )
}

export function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

export function DropdownMenuRadioItem({ children, selected, onSelect }: { children: React.ReactNode; selected?: boolean; onSelect?: () => void }) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer px-3 py-2 text-sm rounded hover:bg-gray-100"
      onClick={onSelect}
    >
      {selected && <CircleIcon className="w-3 h-3" />}
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1 text-xs text-gray-500">{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="border-t my-1" />
}

// ---------------- Navbar Component ----------------
export default function Navbar() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="text-xl font-bold">My Portfolio</div>

      <div className="flex items-center gap-4">
        <a href="#home" className="hover:text-blue-500">Home</a>
        <a href="#about" className="hover:text-blue-500">About</a>

        {/* Dropdown 1 */}
        <DropdownMenu
          id="services"
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          trigger={
            <div className="flex items-center gap-1">
              Services <ChevronDownIcon className="w-4 h-4" />
            </div>
          }
        >
          <DropdownMenuLabel>Web Services</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => console.log("Web Dev")}>Web Development</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("UI/UX")}>UI/UX Design</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={true} onChange={() => console.log("Newsletter toggled")}>
            Newsletter
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem selected={true} onSelect={() => console.log("Option 1")}>Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem onSelect={() => console.log("Option 2")}>Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenu>

        {/* Dropdown 2 */}
        <DropdownMenu
          id="projects"
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
          trigger={
            <div className="flex items-center gap-1">
              Projects <ChevronDownIcon className="w-4 h-4" />
            </div>
          }
        >
          <DropdownMenuItem onClick={() => console.log("Project A")}>Project A</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Project B")}>Project B</DropdownMenuItem>
        </DropdownMenu>

        <a href="#contact" className="hover:text-blue-500">Contact</a>
      </div>
    </nav>
  )
}


import React from "react"
import { cn } from "@/lib/utils"
import { NavMenu } from "@/components/NavMenu"

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-6 lg:space-x-6", className)}>
      <div className="flex items-center space-x-6">
        <NavMenu />
      </div>
    </nav>
  )
}

"use client"

import { Plus, MoreVertical, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

const categories = ["Frontend", "Backend", "Tools", "Design"]

export default function SkillsPage() {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
          <p className="text-muted-foreground">Manage your expertise and proficiency levels.</p>
        </div>
        <Button className="flex gap-2">
          <Plus className="h-4 w-4" /> Add New Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">{category}</CardTitle>
              <Badge variant="secondary">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Example Skill Item */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">React / Next.js</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">90%</span>
                    <DropdownMenu 
                     id={`skill-${category}`}
                    openDropdownId={openDropdownId}
                    setOpenDropdownId={setOpenDropdownId}
                    >
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Progress value={90} className="h-2" />
              </div>

              {/* Add Skill Button Inside Category */}
              <Button variant="ghost" className="w-full border-dashed border-2 h-10 text-muted-foreground">
                + Quick Add to {category}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
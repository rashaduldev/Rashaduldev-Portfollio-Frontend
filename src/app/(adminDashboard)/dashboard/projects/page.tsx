import { Plus, ExternalLink, Github, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Card } from "@/components/ui/card"

const projects = [
  {
    id: "1",
    name: "E-Commerce Platform",
    category: "Web",
    stack: ["Next.js", "Prisma", "Stripe"],
    isFeatured: true,
    status: "Published"
  },
  {
    id: "2",
    name: "AI SaaS Wrapper",
    category: "AI",
    stack: ["OpenAI", "Tailwind"],
    isFeatured: false,
    status: "Draft"
  }
]

export default function ProjectsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects Portfolio</h1>
        <Link href="/admin/projects/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Create Project</Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {project.name}
                    {project.isFeatured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{project.category}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {project.stack.slice(0, 2).map(s => (
                      <span key={s} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={project.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon"><Github className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4"/></Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
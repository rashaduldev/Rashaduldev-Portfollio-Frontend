import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, MessageSquare, Eye } from "lucide-react";

const stats = [
  { label: "Total Visitors", value: "12,450", icon: Users, color: "text-blue-600" },
  { label: "Project Views", value: "3,200", icon: Eye, color: "text-emerald-600" },
  { label: "Total Projects", value: "24", icon: Briefcase, color: "text-primary" },
  { label: "New Messages", value: "12", icon: MessageSquare, color: "text-purple-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Experience & Education</h1>
        <Button size="sm"><Plus className="mr-2 h-4 w-4"/> Add Entry</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Example Row */}
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h2 className="font-bold">Senior Developer @ Tech Corp</h2>
                <p className="text-sm text-slate-500">2021 - Present (Current)</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
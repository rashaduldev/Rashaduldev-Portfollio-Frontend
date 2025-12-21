import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Manage Profile</h1>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input defaultValue="Full Stack Developer" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea className="w-full min-h-25 p-3 border rounded-md" />
          </div>
          <Button>Save Profile</Button>
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <div className="border rounded-lg p-4 bg-white space-y-4">
            {/* Logic for Add/Edit Skills mapped here */}
            <p className="text-sm text-slate-500">Dynamically manage your tech stack...</p>
            <Button variant="outline">+ Add Skill</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
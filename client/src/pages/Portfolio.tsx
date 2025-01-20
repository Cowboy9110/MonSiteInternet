import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/features/portfolio/ProjectCard";
import { type Project } from "@db/schema";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("informatique");
  
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(
    (project) => project.category === activeTab
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      
      <Tabs
        defaultValue="informatique"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="informatique">Informatique</TabsTrigger>
          <TabsTrigger value="video">Montage Vidéo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informatique" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

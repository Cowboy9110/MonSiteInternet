import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type Project } from "@db/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden bg-white/5 hover:bg-white/10 hover:scale-[1.02] border-white/10 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="aspect-video bg-muted relative">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="object-cover w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="mb-2">{project.title}</CardTitle>
            <div className="space-x-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/portfolio/${project.id}`}>Voir plus</Link>
          </Button>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </CardContent>
    </Card>
  );
}
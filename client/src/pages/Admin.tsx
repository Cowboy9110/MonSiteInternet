import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type Project } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  thumbnail: z.string().url("L'URL de l'image est invalide"),
  category: z.enum(["informatique", "video"]),
  tags: z.string().transform((str) => str.split(",").map((s) => s.trim())),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("view");

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      category: "informatique",
    },
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      form.reset();
      toast({
        title: "Projet ajouté",
        description: "Le projet a été ajouté avec succès.",
      });
      setActiveTab("view");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du projet.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Gestion du Portfolio</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="view">Voir les projets</TabsTrigger>
          <TabsTrigger value="add">Ajouter un projet</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau projet</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous pour ajouter un nouveau projet à votre portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Titre du projet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description du projet" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <FormControl>
                          <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            {...field}
                          >
                            <option value="informatique">Informatique</option>
                            <option value="video">Montage Vidéo</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (séparés par des virgules)</FormLabel>
                        <FormControl>
                          <Input placeholder="react, typescript, web" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    Ajouter le projet
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
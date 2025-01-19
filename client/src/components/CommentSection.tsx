import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { type Comment } from "@db/schema";

interface CommentSectionProps {
  projectId: number;
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments", projectId],
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments", projectId] });
      reset();
      toast({
        title: "Commentaire publié",
        description: "Votre commentaire a été ajouté avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication du commentaire.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    mutation.mutate(data.content);
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Commentaires</h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <Textarea
          placeholder="Laissez un commentaire..."
          {...register("content", { required: true })}
        />
        <Button type="submit" disabled={isSubmitting}>
          Publier
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`} />
              <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{comment.author}</div>
              <p className="text-muted-foreground">{comment.content}</p>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

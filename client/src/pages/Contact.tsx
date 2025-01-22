
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactForm = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      console.log('Form data being sent:', data);
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne. Veuillez vérifier votre connexion internet.");
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Erreur lors de l'envoi");
        }

        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Une erreur réseau est survenue");
      }
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message
        : "Une erreur est survenue lors de l'envoi du message";

      toast({
        title: "Erreur d'envoi",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactForm) {
    console.log("Données du formulaire :", data);
    console.log("État de validation:", form.formState.errors);
    mutation.mutate(data);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-muted-foreground">
            Envoyez-moi un message et je vous répondrai dès que possible.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Votre nom" 
                      {...field} 
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="votre@email.com" 
                      {...field} 
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Votre message..."
                      className="min-h-[150px]"
                      {...field}
                      disabled={mutation.isPending}
                    />
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
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

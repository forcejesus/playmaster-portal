import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Game } from "@/types/game";

const planningSchema = z.object({
  jeu: z.string().min(1, "Veuillez sélectionner un jeu"),
  date_debut: z.string().min(1, "La date de début est requise"),
  date_fin: z.string().min(1, "La date de fin est requise"),
  heure_debut: z.string().min(1, "L'heure de début est requise"),
  heure_fin: z.string().min(1, "L'heure de fin est requise"),
  limite_participant: z.coerce.number().min(1, "Au moins 1 participant est requis"),
  type: z.enum(["attribuer", "libre"]),
});

type PlanningForm = z.infer<typeof planningSchema>;

const GamePlanner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const form = useForm<PlanningForm>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      jeu: "",
      date_debut: "",
      date_fin: "",
      heure_debut: "",
      heure_fin: "",
      type: "attribuer",
      limite_participant: 3,
    },
  });

  const { data: gamesResponse, isLoading: isLoadingGames } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://kahoot.nos-apps.com/api/jeux", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as { data: Game[] };
    },
  });

  const createPlanning = useMutation({
    mutationFn: async (data: PlanningForm) => {
      const token = localStorage.getItem("token");
      const payload = {
        ...data,
        statut: "en attente",
      };
      
      const response = await axios.post(
        "http://kahoot.nos-apps.com/api/planification",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch games query to update the dashboard
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Planification créée avec succès");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la création de la planification";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: PlanningForm) => {
    createPlanning.mutate(data);
  };

  if (isLoadingGames) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Planifier un jeu</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jeu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sélectionner un jeu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un jeu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gamesResponse?.data.map((game) => (
                        <SelectItem key={game._id} value={game._id}>
                          {game.titre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heure_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heure_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="limite_participant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de participants</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de planification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="attribuer">Attribuer</SelectItem>
                      <SelectItem value="libre">Libre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createPlanning.isPending}
            >
              {createPlanning.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer la planification"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GamePlanner;
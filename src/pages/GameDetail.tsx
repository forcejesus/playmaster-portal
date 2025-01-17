import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Game } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Users, HelpCircle, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { ImageLoader } from "@/components/ui/image-loader";

const GameDetail = () => {
  const { id } = useParams();

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const response = await axios.get(`http://kahoot.nos-apps.com/api/jeux/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalParticipants = game?.planification.reduce(
    (acc: number, plan: any) => acc + plan.participants.length,
    0
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <motion.h1 variants={item} className="text-3xl font-bold">
              {game?.titre}
            </motion.h1>
          </div>
        </div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{game?.questions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planifications</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{game?.planification.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game?.questions.map((question: any, index: number) => (
                <div key={question._id} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <span className="text-muted-foreground">Q{index + 1}.</span>
                    <div className="space-y-2 flex-1">
                      <p>{question.libelle}</p>
                      {question.fichier && (
                        <ImageLoader
                          src={`http://kahoot.nos-apps.com/${question.fichier}`}
                          alt="Question media"
                          className="max-w-xs rounded-md"
                          fallback="/placeholder.svg"
                        />
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{question.temps} secondes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game?.planification.map((plan: any) => (
                <div key={plan._id} className="p-4 rounded-lg border">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">PIN</p>
                        <p className="font-semibold">{plan.pin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <p className="font-semibold capitalize">{plan.statut}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Période</p>
                        <p className="font-semibold">
                          {plan.date_debut} - {plan.date_fin}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participants</p>
                        <p className="font-semibold">
                          {plan.participants.length} / {plan.limite_participant}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameDetail;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Plus,
  BarChart2,
  LogOut,
  Users,
  GamepadIcon,
  TrendingUp,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { logout, user } = useAuth();

  const stats = [
    { id: 1, title: "Jeux créés", value: 12, icon: GamepadIcon, color: "text-blue-500" },
    { id: 2, title: "Utilisateurs", value: 150, icon: Users, color: "text-green-500" },
    { id: 3, title: "Jeux joués", value: 300, icon: TrendingUp, color: "text-purple-500" },
    { id: 4, title: "Cette semaine", value: "24 jeux", icon: Calendar, color: "text-orange-500" }
  ];

  const recentGames = [
    { id: 1, title: "Quiz Histoire", date: "2024-02-01", players: 25 },
    { id: 2, title: "Mathématiques Avancées", date: "2024-02-02", players: 18 },
    { id: 3, title: "Sciences Naturelles", date: "2024-02-03", players: 32 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <motion.h1 variants={item} className="text-3xl font-bold">
              Tableau de bord
            </motion.h1>
            <motion.p variants={item} className="text-muted-foreground">
              Bienvenue, {user?.name} 👋
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div variants={item}>
              <Link to="/quiz-creator">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" /> Nouveau jeu
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Button
                variant="outline"
                onClick={logout}
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border-destructive/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div 
          variants={item}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map(stat => (
            <Card key={stat.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full bg-card ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Jeux récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGames.map(game => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <GamepadIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{game.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {game.players} joueurs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
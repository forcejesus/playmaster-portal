import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Plus,
  BarChart2,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { logout } = useAuth();

  const stats = [
    { id: 1, title: "Jeux créés", value: 12 },
    { id: 2, title: "Utilisateurs", value: 150 },
    { id: 3, title: "Jeux joués", value: 300 },
  ];

  const recentGames = [
    { id: 1, title: "Jeu 1", date: "2023-10-01" },
    { id: 2, title: "Jeu 2", date: "2023-10-02" },
    { id: 3, title: "Jeu 3", date: "2023-10-03" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Tableau de bord
          </motion.h1>
          <div className="flex items-center gap-4">
            <Link to="/quiz-creator">
              <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" /> Nouveau jeu
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(stat => (
            <Card key={stat.id} className="p-4">
              <h2 className="text-lg font-semibold">{stat.title}</h2>
              <p className="text-2xl">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-semibold">Jeux récents</h2>
          <ul className="space-y-2">
            {recentGames.map(game => (
              <li key={game.id} className="flex justify-between">
                <span>{game.title}</span>
                <span>{game.date}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  GamepadIcon,
  Users,
  Clock,
  Plus,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const stats = [
    {
      title: "Jeux actifs",
      value: "12",
      icon: GamepadIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Élèves participants",
      value: "156",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Sessions planifiées",
      value: "8",
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Temps de jeu total",
      value: "24h",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const recentGames = [
    {
      title: "Mathématiques - Fractions",
      date: "Aujourd'hui",
      participants: 25,
      subject: "Mathématiques",
      color: "bg-blue-100",
    },
    {
      title: "Histoire - Moyen Âge",
      date: "Hier",
      participants: 28,
      subject: "Histoire",
      color: "bg-green-100",
    },
    {
      title: "Géographie - Capitales",
      date: "Il y a 2 jours",
      participants: 22,
      subject: "Géographie",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Tableau de bord
          </motion.h1>
          <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Nouveau jeu
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon
                        className={`h-6 w-6 ${stat.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Sessions à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGames.map((game) => (
                    <div
                      key={game.title}
                      className="flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${game.color} 0%, white 100%)`,
                      }}
                    >
                      <div>
                        <h3 className="font-medium">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {game.date} • {game.participants} participants
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="shadow-sm">
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Performance des jeux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Graphique des performances
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
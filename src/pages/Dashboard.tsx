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

const Dashboard = () => {
  const stats = [
    {
      title: "Jeux actifs",
      value: "12",
      icon: GamepadIcon,
      color: "text-blue-500",
    },
    {
      title: "Élèves participants",
      value: "156",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Sessions planifiées",
      value: "8",
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      title: "Temps de jeu total",
      value: "24h",
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  const recentGames = [
    {
      title: "Mathématiques - Fractions",
      date: "Aujourd'hui",
      participants: 25,
    },
    {
      title: "Histoire - Moyen Âge",
      date: "Hier",
      participants: 28,
    },
    {
      title: "Géographie - Capitales",
      date: "Il y a 2 jours",
      participants: 22,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau jeu
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full bg-background ${stat.color} bg-opacity-10`}
                  >
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
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Sessions à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGames.map((game) => (
                  <div
                    key={game.title}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{game.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {game.date} • {game.participants} participants
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Performance des jeux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Graphique des performances
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
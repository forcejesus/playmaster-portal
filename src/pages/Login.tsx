import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover'
      }}>
        <div className="w-full h-full bg-primary/10 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="text-white space-y-4">
            <h1 className="text-4xl font-bold">Khoot ECES JEUX</h1>
            <p className="text-xl opacity-80">Plateforme de gestion des jeux pédagogiques</p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-secondary to-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Khoot ECES JEUX</CardTitle>
            <p className="text-sm text-muted-foreground">
              Portail des enseignants
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@ecole.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
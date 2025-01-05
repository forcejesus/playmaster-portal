import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const QuizNavigation = () => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link to="/dashboard">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </Link>
    </div>
  );
};
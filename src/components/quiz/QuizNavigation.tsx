import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const QuizNavigation = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-8 left-8 z-50"
    >
      <Link to="/dashboard">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white hover:bg-primary/10 border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </Link>
    </motion.div>
  );
};
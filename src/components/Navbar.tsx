import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Kahoot Admin</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
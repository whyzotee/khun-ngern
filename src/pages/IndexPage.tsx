import { useEffect } from "react";
import { useLocation } from "wouter";
import { Landmark } from "lucide-react";

const IndexPage = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/bill-center");
    }, 2000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
          <Landmark className="text-primary-foreground w-16 h-16" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tighter">
          KHUN NGERN
        </h1>
        <div className="mt-4 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

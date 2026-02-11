import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[hsl(50,60%,92%)] to-[hsl(30,80%,90%)] border-[hsl(30,60%,80%)] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground">🌊 Word Flood</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 bg-[hsl(30,40%,85%)]">
            <TabsTrigger value="signin" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm onSuccess={onClose} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm onSuccess={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
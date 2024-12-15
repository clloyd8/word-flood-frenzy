import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RulesDialog = ({ open, onOpenChange }: RulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to Play Word Flood</DialogTitle>
          <DialogDescription>
            <div className="space-y-4 mt-4">
              <p>
                Word Flood is a word-finding game where you need to create words before the board fills up!
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Rules:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click letters to form words (minimum 3 letters)</li>
                  <li>Submit valid words to clear those letters from the board</li>
                  <li>New letters will flood the board over time</li>
                  <li>Game ends when the board fills up completely</li>
                  <li>Longer words score more points!</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Tips:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Focus on clearing longer words for higher scores</li>
                  <li>Keep an eye on empty spaces - they'll fill up quickly!</li>
                  <li>Sign in to save your high scores</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
import { useEffect, useState } from "react";

interface FloodOverlayProps {
  isVisible: boolean;
}

const FloodOverlay = ({ isVisible }: FloodOverlayProps) => {
  const [height, setHeight] = useState("0%");

  useEffect(() => {
    if (isVisible) {
      // Start the flooding animation
      setTimeout(() => setHeight("100%"), 100);
    } else {
      setHeight("0%");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      style={{ zIndex: 10 }}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-water-medium/50 backdrop-blur-sm"
        style={{ 
          height: height,
          transition: "height 2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
};

export default FloodOverlay;
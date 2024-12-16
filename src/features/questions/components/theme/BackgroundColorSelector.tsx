import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paintbrush } from "lucide-react";

const backgroundColors = [
  { name: 'Dark Blue', value: '#1A1F2C' },
  { name: 'Dark Purple', value: '#1E1B2C' },
  { name: 'Dark Gray', value: '#222222' },
  { name: 'Navy Blue', value: '#1B2440' },
  { name: 'Charcoal', value: '#2C2C2C' },
  { name: 'Deep Purple', value: '#2D1B40' },
];

interface BackgroundColorSelectorProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

const BackgroundColorSelector = ({ onColorChange, currentColor }: BackgroundColorSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <Paintbrush className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-4 bg-white/90 backdrop-blur-lg border-white/20"
        align="end"
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Cor do fundo</h4>
          <div className="grid grid-cols-3 gap-2">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                className={`w-full aspect-square rounded-lg transition-all ${
                  currentColor === color.value ? 'ring-2 ring-white ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  onColorChange(color.value);
                  setIsOpen(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundColorSelector;
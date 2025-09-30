import * as Slider from "@radix-ui/react-slider";

interface AnimationSpeedSliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function SpeedSlider({
  value,
  onChange,
  min = 0,
  max = 30,
  step = 1,
}: AnimationSpeedSliderProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">
        Speed for the icon to move the map: {value}s
      </label>
      <Slider.Root
        className="relative flex items-center w-full h-5"
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="relative flex-grow h-1 rounded-full bg-border">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-primary 
                     hover:bg-primary-hover 
                     focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      </Slider.Root>
    </div>
  );
}

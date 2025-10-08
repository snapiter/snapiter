import { Trackable } from '@/store/atoms';
import Logo from '@snapiter/designsystem/dist/layout/logo/Logo';

interface SnapIterLoaderProps {
  website: Trackable | null;
}

export default function SnapIterLoader({ website }: SnapIterLoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[10000] bg-background flex items-center justify-center"
      role="status"
      aria-busy={!website?.title}
    >
      <div
        className="
          bg-surface flex flex-col items-center justify-center gap-6 w-full relative h-full
          md:rounded-2xl md:border md:border-border md:max-w-sm py-4 md:py-8 md:h-auto
        "
      >
        <div className="flex flex-col items-center justify-center">
          <Logo size="xxl" showTitle={false} />
        </div>
        <div className="relative h-12 w-full  px-4 overflow-hidden">
          <div
            className={`w-full bg-background rounded-full h-2 overflow-hidden mt-4
              ${website?.title ? 'opacity-0' : 'opacity-100'}`}
            >
            <div className="h-2 bg-primary rounded-full animate-loading" />
          </div>

          <h1
            className={`
      absolute inset-0 flex items-center justify-center
      transition-all duration-700 ease-out text-2xl font-bold text-foreground whitespace-nowrap
      ${website?.title ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
    `}
          >
            {website?.title ?? ''}
          </h1>
        </div>



      </div>
    </div>
  );
}

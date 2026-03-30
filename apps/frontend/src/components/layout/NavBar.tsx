import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="container relative mx-auto flex h-16 items-center justify-between px-6">
        
        <div className="flex items-center">
          <span className="font-display text-xl font-bold text-brand">
            UniLearn
          </span>
        </div>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium tracking-tight">
          {["About", "Courses", "Pricing", "Contact"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-on-surface-variant hover:text-brand transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-xs font-mono uppercase tracking-widest">
            Login
          </Button>
          <Button variant="primary" className="px-5">
            Initialize
          </Button>
        </div>

      </div>
    </header>
  );
}
import { Link } from "react-router-dom";

// TODO: Conditional Rendering
// TODO: Mark Active Pages using active color and underline
// TODO: Edit the Typography

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center h-16 px-8 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter font-headline">
          UniLearn
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Courses", "Pricing", "Contact"].map((item) => (
            <a 
              key={item}
              href={`${item.toLowerCase()}`} 
              className="font-headline font-bold tracking-tight text-on-surface-variant hover:text-white transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded text-on-surface-variant hover:bg-surface-high transition-all duration-150 text-sm font-medium">
            Login
          </button>
          <button className="px-5 py-2 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
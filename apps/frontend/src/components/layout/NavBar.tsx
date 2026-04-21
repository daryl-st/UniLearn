import { Link } from "react-router-dom";

// TODO: Conditional Rendering
// TODO: Mark Active Pages using active color and underline
// TODO: Edit the Typography

export function Navbar() {
  return (
    // let's have the UniLearn logo along with the nav links on the left and the login/signup buttons on the right.
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <div className="flex justify-between items-center h-16 px-8 w-full max-w-7xl mx-auto">
        <div className="flex justify-start gap-7">
          <Link to="/home" className="text-2xl font-bold text-primary tracking-tighter font-headline">
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
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="px-4 py-2 rounded text-on-surface-variant hover:bg-surface-high transition-all duration-150 text-sm font-medium">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-5 py-2 rounded-sm bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
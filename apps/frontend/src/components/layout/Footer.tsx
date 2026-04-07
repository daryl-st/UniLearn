import { Globe, Terminal } from "lucide-react";

export const Footer = () => (
  <footer className="bg-background w-full border-t border-outline-variant">
    <div className="flex flex-col md:flex-row justify-between items-center py-10 px-8 w-full max-w-7xl mx-auto gap-8">
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="text-lg font-bold text-primary font-headline">UniLearn</div>
        <p className="text-sm text-on-surface-variant">© 2049 UniLearn Protocol. All rights reserved.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {["Privacy Policy", "Terms of Service", "Cookie Settings", "Security"].map((item) => (
          <a key={item} className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">{item}</a>
        ))}
      </div>
      <div className="flex gap-4">
        <Globe className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors w-5 h-5" />
        <Terminal className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors w-5 h-5" />
      </div>
    </div>
  </footer>
);
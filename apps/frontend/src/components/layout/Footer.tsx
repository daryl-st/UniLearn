export function Footer() {
    return (
        <footer className="border-t border-[#49454f]/15 bg-surface py-8">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <span className="font-display font-bold text-on-surface">UniLearn</span>
                <span className="text-xs text-on-surface-variant/70">© 2026 UniLearn Protocol. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-on-surface transition-colors">Cookie Settings</a>
                <a href="#" className="hover:text-on-surface transition-colors">Security</a>
            </div>
            </div>
        </footer>
    )
}
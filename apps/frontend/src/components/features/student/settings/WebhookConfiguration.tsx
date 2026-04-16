export function WebhookConfiguration() {
  return (
    <div className="mt-16 pt-12 border-t border-outline-variant/10">
      <h4 className="font-headline text-lg text-white font-bold mb-8 uppercase tracking-tight">Webhook Configuration</h4>
      <div className="space-y-8 max-w-2xl">
        <div className="space-y-3">
          <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Payload URL</label>
          <input
            className="w-full bg-surface/60 border border-outline-variant/30 rounded-sm px-5 py-3.5 text-sm text-white focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all font-mono outline-none placeholder:text-on-surface-variant/30"
            placeholder="https://api.yourdomain.com/webhooks"
            type="url"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Event Triggers</label>
            <select className="w-full bg-surface/60 border border-outline-variant/30 rounded-sm px-5 py-3.5 text-sm text-white focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer">
              <option>All System Events</option>
              <option>Course Completion</option>
              <option>AI Model Ready</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Environment</label>
            <div className="flex p-1.5 bg-surface/60 rounded-sm border border-outline-variant/30">
              <button className="flex-1 py-2 text-xs font-bold rounded-sm bg-surface-high text-primary shadow-lg">STAGING</button>
              <button className="flex-1 py-2 text-xs font-bold rounded-sm text-on-surface-variant hover:text-white transition-colors">PRODUCTION</button>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button className="w-full md:w-auto bg-surface-high text-white px-10 py-4 rounded-sm font-bold text-xs hover:bg-surface-high/80 active:scale-95 transition-all shadow-lg border border-outline-variant/20 tracking-widest">
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
}

import { Activity, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="medical-gradient text-primary-foreground py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RapidSepsis-ABX™</h1>
            <p className="text-sm text-primary-foreground/80">Intelligent Antibiotic Decision Support</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
          <Shield className="w-4 h-4" />
          <span>Clinical Decision Support Tool</span>
        </div>
      </div>
    </header>
  );
}

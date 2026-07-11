import Link from "next/link";
import { NotificationManager } from "./NotificationManager";

export const Header = ({ onExport, onImport }: { onExport: () => void, onImport: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <header className="text-center space-y-3 sm:space-y-5">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
        Gestionnaire d'Achats
      </h1>
      <p className="text-stone-400 text-base sm:text-lg px-2">
        Suivez vos dépenses et paiements échelonnés avec précision.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-[#23201f] hover:bg-stone-800 text-stone-300 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-stone-800 transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Exporter
        </button>
        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-orange-900/50 transition-colors shadow-sm cursor-pointer">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Importer
          <input type="file" accept=".json" onChange={onImport} className="hidden" />
        </label>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Achats</span>
        </Link>
        <NotificationManager />
      </div>
    </header>
  );
};

import { useState } from "react";
import Image from "next/image";

export const EasterEgg = () => {
  const [showCat, setShowCat] = useState(false);

  const handleShowCat = () => {
    setShowCat(true);
    setTimeout(() => {
      setShowCat(false);
    }, 5000);
  };

  return (
    <>
      <button
        onClick={handleShowCat}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#23201f] border border-stone-700 shadow-xl flex items-center justify-center hover:bg-stone-800 transition-colors z-40 opacity-50 hover:opacity-100"
        title="Miaou"
      >
        <span className="text-xl">🐱</span>
      </button>

      {showCat && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl animate-bounce">
            <Image 
              src="/oiia-cat.gif"
              alt="OIIA Cat"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
};

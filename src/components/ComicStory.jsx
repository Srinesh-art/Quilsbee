import React from 'react';
import { Eye, ArrowRight, Sparkles, Activity, ShieldCheck, Thermometer } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ComicStory({ chapters, onExplore }) {
  return (
    <section id="story" className="relative w-full py-32 px-6 md:px-12 bg-[#050505] text-[#EAE6DF] z-10">
      <div className="max-w-6xl mx-auto space-y-40">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-24">
            {/* Chapter Editorial Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-[#222222] pb-12">
              <div className="flex items-center justify-center space-x-3">
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                <span className="micro-label text-[#D4AF37]">{chapter.chapterNumber}</span>
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-light tracking-wide text-[#EAE6DF]">
                {chapter.title}
              </h2>
              <p className="text-sm md:text-base text-[#8A8780] font-light italic">
                {chapter.subtitle}
              </p>
            </div>

            {/* Comic Panels Container */}
            <div className="space-y-32">
              {chapter.panels.map((panel, pIdx) => (
                <div 
                  key={panel.id} 
                  className="relative group transition-all duration-700"
                >
                  {panel.type === 'comic-image' ? (
                    /* Graphic Novel Illustrated Panel */
                    <div className="relative rounded-lg overflow-hidden border border-[#222222] bg-[#0A0A0A] shadow-2xl transition-all duration-500 hover:border-[#333333]">
                      {/* Film Grain & Editorial Frame */}
                      <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] w-full bg-[#050505]">
                        <img
                          src={panel.src}
                          alt={panel.caption || "Quantum Story Panel"}
                          className="w-full h-full object-contain md:object-cover scale-100 group-hover:scale-102 transition-transform duration-1000 filter contrast-105 brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      </div>

                      {/* Panel Footer & Dialogue Overlay */}
                      <div className="p-8 md:p-10 space-y-6 bg-gradient-to-b from-[#0A0A0A]/90 to-[#050505]">
                        {/* Telemetry metadata */}
                        {panel.metrics && (
                          <div className="flex flex-wrap items-center gap-6 border-b border-[#1F1F1F] pb-4 font-mono text-xs text-[#8A8780]">
                            <div className="flex items-center space-x-2">
                              <Activity className="w-3.5 h-3.5 text-[#4ECDC4]" />
                              <span>STATUS: <strong className="text-[#EAE6DF]">{panel.metrics.status}</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-3.5 h-3.5 text-[#4ECDC4]" />
                              <span>TEMP: <strong className="text-[#EAE6DF]">{panel.metrics.temp}</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>POWER: <strong className="text-[#EAE6DF]">{panel.metrics.power}</strong></span>
                            </div>
                          </div>
                        )}

                        {/* Dialogue / Caption */}
                        <div className="space-y-3">
                          {panel.dialogue && (
                            <blockquote className="text-xl md:text-2xl font-serif italic text-[#EAE6DF] pl-4 border-l-2 border-[#D4AF37]">
                              "{panel.dialogue}"
                            </blockquote>
                          )}
                          <p className="text-sm md:text-base text-[#8A8780] font-light leading-relaxed max-w-3xl">
                            {panel.caption}
                          </p>
                        </div>

                        {/* Interactive Explore Action Button */}
                        {panel.exploreTarget && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                sound.playGateAdd();
                                onExplore(panel.exploreTarget);
                              }}
                              className="group/btn relative px-6 py-3 rounded-full border border-[#D4AF37]/40 bg-[#0A0A0A] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] transition-all duration-300 flex items-center space-x-3 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="tracking-[0.2em] text-xs uppercase font-medium">
                                {panel.exploreLabel || "EXPLORE"}
                              </span>
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Editorial Narrative Panel */
                    <div className="glass-panel p-10 md:p-14 rounded-xl border border-[#222222] relative overflow-hidden space-y-6">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
                        <span className="micro-label text-[#4ECDC4]">{panel.tag}</span>
                      </div>
                      
                      <h3 className="text-3xl md:text-5xl font-serif font-light text-[#EAE6DF]">
                        {panel.title}
                      </h3>

                      <p className="text-base md:text-lg text-[#8A8780] font-light leading-relaxed max-w-3xl">
                        {panel.caption}
                      </p>

                      {panel.mathNote && (
                        <div className="inline-block p-4 rounded-lg bg-[#050505] border border-[#222222] font-mono text-sm text-[#4ECDC4]">
                          {panel.mathNote}
                        </div>
                      )}

                      {panel.exploreTarget && (
                        <div className="pt-4 flex">
                          <button
                            onClick={() => {
                              sound.playGateAdd();
                              onExplore(panel.exploreTarget);
                            }}
                            className="px-6 py-3 rounded-full border border-[#EAE6DF]/30 bg-[#0A0A0A] hover:bg-[#EAE6DF] text-[#EAE6DF] hover:text-[#050505] transition-all duration-300 flex items-center space-x-3"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="tracking-[0.2em] text-xs uppercase font-medium">
                              {panel.exploreLabel || "EXPLORE"}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Volume2, VolumeX, Maximize2, Layers, Compass } from 'lucide-react';
import { voiceEngine } from '../utils/voiceEngine';
import { sound } from '../utils/audio';

export default function BookComicViewer({ comicPages, onExplore }) {
  // Page index (0 to 10)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' | 'prev'
  const [viewMode, setViewMode] = useState('double'); // 'double' | 'single'

  // Speaking Character State
  const [speakingCharacter, setSpeakingCharacter] = useState(null);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [activeLineText, setActiveLineText] = useState('');
  const [speakingPageNum, setSpeakingPageNum] = useState(null);

  // Responsive mode check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1080) {
        setViewMode('single');
      } else {
        setViewMode('double');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopCharacterVoice();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, viewMode, isFlipping]);

  // Touch Swipe navigation
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrev();
  };

  const totalPages = comicPages.length;

  const goToNext = () => {
    if (isFlipping) return;
    stopCharacterVoice();
    const step = viewMode === 'double' ? 2 : 1;
    if (currentPageIndex + step < totalPages) {
      sound.playGateAdd();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + step));
        setIsFlipping(false);
      }, 400);
    } else if (currentPageIndex < totalPages - 1) {
      sound.playGateAdd();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(totalPages - 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const goToPrev = () => {
    if (isFlipping) return;
    stopCharacterVoice();
    const step = viewMode === 'double' ? 2 : 1;
    if (currentPageIndex - step >= 0) {
      sound.playGateAdd();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(prev => Math.max(0, prev - step));
        setIsFlipping(false);
      }, 400);
    } else if (currentPageIndex > 0) {
      sound.playGateAdd();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(0);
        setIsFlipping(false);
      }, 400);
    }
  };

  // Character Click: Immediately trigger voice sequence & in-place focus
  const handleCharacterClick = (char, pageNum) => {
    sound.playSwitch();
    setSpeakingCharacter(char);
    setSpeakingPageNum(pageNum);
    setActiveLineIndex(0);
    setActiveLineText(char.dialogue[0]);

    voiceEngine.playDialogueSequence({
      character: char,
      onLineStart: (idx, text) => {
        setActiveLineIndex(idx);
        setActiveLineText(text);
      },
      onComplete: () => {
        setTimeout(() => {
          stopCharacterVoice();
        }, 800);
      }
    });
  };

  const stopCharacterVoice = () => {
    voiceEngine.stop();
    setSpeakingCharacter(null);
    setSpeakingPageNum(null);
  };

  const leftPage = comicPages[currentPageIndex];
  const rightPage = (viewMode === 'double' && currentPageIndex + 1 < totalPages)
    ? comicPages[currentPageIndex + 1]
    : null;

  return (
    <section id="comics" className="relative w-full min-h-screen py-24 px-3 md:px-8 bg-[#050505] text-[#EAE6DF] z-20 flex flex-col items-center justify-center select-none overflow-hidden">
      
      {/* Background Starry Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#000000] pointer-events-none" />

      {/* Top Editorial Book Header */}
      <div className="relative z-10 text-center space-y-2 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
          <span className="micro-label text-[#D4AF37]">
            {leftPage?.chapter || "CHAPTER 01"} • LIVING GRAPHIC NOVEL
          </span>
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-light text-[#EAE6DF] tracking-wide">
          {leftPage?.title || "THE FIRST QUBIT"}
        </h2>

        <p className="text-xs md:text-sm text-[#8A8780] font-light">
          Click any character to hear their voice in real time. Turn pages using arrow keys or buttons.
        </p>
      </div>

      {/* PHYSICAL 3D BOOK ENCLOSURE */}
      <div 
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Hardcover Outer Frame with Depth Shadow & Spine Emboss */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#141414] via-[#0A0A0A] to-[#050505] border border-[#2E2E2E] p-3 md:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.95)] transition-all duration-500">
          
          {/* Top Gold Foil Embossed Title Strip on Hardcover */}
          <div className="hidden md:flex items-center justify-between pb-3 mb-2 border-b border-[#1F1F1F] px-4 font-mono text-[10px] text-[#8A8780] tracking-widest uppercase">
            <span className="flex items-center space-x-2 text-[#D4AF37]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THE QUANTUM WORLD — VOL 01: THE FIRST QUBIT</span>
            </span>
            <span>QUANTUM ACADEMY ARCHIVE • SECTOR 7</span>
          </div>

          {/* Book Spine Crease Gradient (Center divide in double-page spread) */}
          {viewMode === 'double' && rightPage && (
            <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-10 z-30 pointer-events-none bg-gradient-to-r from-transparent via-[#000000]/70 to-transparent shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]" />
          )}

          {/* SPREAD CONTAINER */}
          <div className={`relative grid gap-3 md:gap-4 items-center justify-center transition-transform duration-500 ${
            viewMode === 'double' && rightPage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
          } ${isFlipping ? 'scale-[0.985] opacity-90' : 'scale-100 opacity-100'}`}>

            {/* ================= LEFT PAGE ================= */}
            <div className="relative rounded-lg overflow-hidden bg-[#050505] border border-[#1A1A1A] shadow-2xl group/page">
              
              {/* Comic Page Image with Cinematic Focus Zoom when Character Speaks */}
              <div 
                className="relative overflow-hidden transition-all duration-700 ease-out"
                style={{
                  transform: speakingPageNum === leftPage.page && speakingCharacter
                    ? `scale(1.06) translate(${(50 - speakingCharacter.hotspot.x) * 0.15}%, ${(50 - speakingCharacter.hotspot.y) * 0.15}%)`
                    : 'scale(1) translate(0%, 0%)',
                  transformOrigin: speakingCharacter
                    ? `${speakingCharacter.hotspot.x + speakingCharacter.hotspot.width / 2}% ${speakingCharacter.hotspot.y + speakingCharacter.hotspot.height / 2}%`
                    : 'center center'
                }}
              >
                <img
                  src={leftPage.image}
                  alt={leftPage.title}
                  className="w-full h-auto max-h-[76vh] object-contain mx-auto pointer-events-none"
                />

                {/* Cinematic Vignette Dim when character speaks on this page */}
                {speakingPageNum === leftPage.page && speakingCharacter && (
                  <div 
                    onClick={stopCharacterVoice}
                    className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[2px] transition-opacity duration-500 cursor-pointer z-20"
                  />
                )}
              </div>

              {/* Character Click Hotspots on Left Page */}
              {leftPage.characters?.map((char) => {
                const isThisSpeaking = speakingCharacter?.id === char.id && speakingPageNum === leftPage.page;

                return (
                  <React.Fragment key={char.id}>
                    {/* Clickable Area */}
                    <button
                      onClick={() => handleCharacterClick(char, leftPage.page)}
                      style={{
                        left: `${char.hotspot.x}%`,
                        top: `${char.hotspot.y}%`,
                        width: `${char.hotspot.width}%`,
                        height: `${char.hotspot.height}%`,
                      }}
                      className={`absolute z-30 rounded-lg cursor-pointer transition-all duration-300 group/char flex items-center justify-center border ${
                        isThisSpeaking
                          ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#D4AF37]/15 shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                          : 'border-transparent hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10'
                      }`}
                      title={`Click to hear ${char.name} speak`}
                    >
                      {/* Subtle Floating Talk Badge on Hover */}
                      {!speakingCharacter && (
                        <div className="opacity-0 group-hover/char:opacity-100 -translate-y-2 group-hover/char:translate-y-0 transition-all duration-300 px-3 py-1 rounded-full bg-[#0A0A0A]/95 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase flex items-center space-x-1.5 shadow-[0_0_20px_rgba(212,175,55,0.5)] pointer-events-none">
                          <Volume2 className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                          <span>TALK • {char.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </button>

                    {/* In-Place Cinematic Speech Bubble Floating Directly Over Character */}
                    {isThisSpeaking && (
                      <div 
                        style={{
                          left: `${Math.min(75, Math.max(25, char.hotspot.x + char.hotspot.width / 2))}%`,
                          top: `${Math.min(80, Math.max(20, char.hotspot.y - 12))}%`,
                        }}
                        className="absolute z-40 -translate-x-1/2 -translate-y-full w-[90%] max-w-sm pointer-events-auto animate-fadeIn"
                      >
                        <div className="glass-panel-deep p-4 rounded-xl border border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)] relative">
                          
                          {/* Character Name Tag & Animated Audio Waveform */}
                          <div className="flex items-center justify-between border-b border-[#222222] pb-2 mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{char.avatar || '💬'}</span>
                              <span className="font-serif text-xs font-semibold text-[#EAE6DF] tracking-wide">
                                {char.name}
                              </span>
                            </div>

                            {/* Voice Equalizer Animated Wave */}
                            <div className="flex items-center space-x-0.5">
                              <span className="w-0.5 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
                              <span className="w-0.5 h-4 bg-[#D4AF37] rounded-full animate-pulse delay-75" />
                              <span className="w-0.5 h-2 bg-[#D4AF37] rounded-full animate-pulse delay-150" />
                              <span className="w-0.5 h-4 bg-[#D4AF37] rounded-full animate-pulse delay-100" />
                            </div>
                          </div>

                          {/* Spoken Text Line */}
                          <p className="font-serif text-sm italic text-[#EAE6DF] leading-relaxed pl-2 border-l-2 border-[#D4AF37]">
                            "{activeLineText}"
                          </p>

                          {/* Dialogue Step Counter */}
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1F1F1F] text-[9px] font-mono text-[#8A8780]">
                            <span>VOICE ACTIVE • LINE {activeLineIndex + 1} OF {char.dialogue.length}</span>
                            <button 
                              onClick={stopCharacterVoice}
                              className="text-[#D4AF37] hover:underline"
                            >
                              DISMISS
                            </button>
                          </div>

                          {/* Bubble Pointer Tail */}
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#0A0A0A] border-b border-r border-[#D4AF37] rotate-45" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Concept Explore Banner on Left Page */}
              {leftPage.explore && !speakingCharacter && (
                <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center">
                  <button
                    onClick={() => {
                      sound.playGateAdd();
                      onExplore(leftPage.explore.target);
                    }}
                    className="px-5 py-2 rounded-full border border-[#D4AF37]/60 bg-[#0A0A0A]/90 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] transition-all duration-300 text-[11px] font-mono tracking-wider font-semibold flex items-center space-x-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{leftPage.explore.label}</span>
                  </button>
                </div>
              )}

              {/* Page Number Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#0A0A0A]/85 border border-[#222222] font-mono text-[10px] text-[#8A8780]">
                PAGE {String(currentPageIndex + 1).padStart(2, '0')}
              </div>
            </div>

            {/* ================= RIGHT PAGE ================= */}
            {viewMode === 'double' && rightPage && (
              <div className="relative rounded-lg overflow-hidden bg-[#050505] border border-[#1A1A1A] shadow-2xl group/page">
                
                {/* Comic Page Image with Cinematic Focus Zoom */}
                <div 
                  className="relative overflow-hidden transition-all duration-700 ease-out"
                  style={{
                    transform: speakingPageNum === rightPage.page && speakingCharacter
                      ? `scale(1.06) translate(${(50 - speakingCharacter.hotspot.x) * 0.15}%, ${(50 - speakingCharacter.hotspot.y) * 0.15}%)`
                      : 'scale(1) translate(0%, 0%)',
                    transformOrigin: speakingCharacter
                      ? `${speakingCharacter.hotspot.x + speakingCharacter.hotspot.width / 2}% ${speakingCharacter.hotspot.y + speakingCharacter.hotspot.height / 2}%`
                      : 'center center'
                  }}
                >
                  <img
                    src={rightPage.image}
                    alt={rightPage.title}
                    className="w-full h-auto max-h-[76vh] object-contain mx-auto pointer-events-none"
                  />

                  {/* Dim overlay when character speaks */}
                  {speakingPageNum === rightPage.page && speakingCharacter && (
                    <div 
                      onClick={stopCharacterVoice}
                      className="absolute inset-0 bg-[#050505]/65 backdrop-blur-[2px] transition-opacity duration-500 cursor-pointer z-20"
                    />
                  )}
                </div>

                {/* Character Click Hotspots on Right Page */}
                {rightPage.characters?.map((char) => {
                  const isThisSpeaking = speakingCharacter?.id === char.id && speakingPageNum === rightPage.page;

                  return (
                    <React.Fragment key={char.id}>
                      <button
                        onClick={() => handleCharacterClick(char, rightPage.page)}
                        style={{
                          left: `${char.hotspot.x}%`,
                          top: `${char.hotspot.y}%`,
                          width: `${char.hotspot.width}%`,
                          height: `${char.hotspot.height}%`,
                        }}
                        className={`absolute z-30 rounded-lg cursor-pointer transition-all duration-300 group/char flex items-center justify-center border ${
                          isThisSpeaking
                            ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/30 bg-[#D4AF37]/15 shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                            : 'border-transparent hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10'
                        }`}
                        title={`Click to hear ${char.name} speak`}
                      >
                        {!speakingCharacter && (
                          <div className="opacity-0 group-hover/char:opacity-100 -translate-y-2 group-hover/char:translate-y-0 transition-all duration-300 px-3 py-1 rounded-full bg-[#0A0A0A]/95 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase flex items-center space-x-1.5 shadow-[0_0_20px_rgba(212,175,55,0.5)] pointer-events-none">
                            <Volume2 className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                            <span>TALK • {char.name.split(' ')[0]}</span>
                          </div>
                        )}
                      </button>

                      {/* In-Place Speech Bubble for Right Page */}
                      {isThisSpeaking && (
                        <div 
                          style={{
                            left: `${Math.min(75, Math.max(25, char.hotspot.x + char.hotspot.width / 2))}%`,
                            top: `${Math.min(80, Math.max(20, char.hotspot.y - 12))}%`,
                          }}
                          className="absolute z-40 -translate-x-1/2 -translate-y-full w-[90%] max-w-sm pointer-events-auto animate-fadeIn"
                        >
                          <div className="glass-panel-deep p-4 rounded-xl border border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)] relative">
                            <div className="flex items-center justify-between border-b border-[#222222] pb-2 mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-base">{char.avatar || '💬'}</span>
                                <span className="font-serif text-xs font-semibold text-[#EAE6DF] tracking-wide">
                                  {char.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-0.5">
                                <span className="w-0.5 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
                                <span className="w-0.5 h-4 bg-[#D4AF37] rounded-full animate-pulse delay-75" />
                                <span className="w-0.5 h-2 bg-[#D4AF37] rounded-full animate-pulse delay-150" />
                                <span className="w-0.5 h-4 bg-[#D4AF37] rounded-full animate-pulse delay-100" />
                              </div>
                            </div>

                            <p className="font-serif text-sm italic text-[#EAE6DF] leading-relaxed pl-2 border-l-2 border-[#D4AF37]">
                              "{activeLineText}"
                            </p>

                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1F1F1F] text-[9px] font-mono text-[#8A8780]">
                              <span>VOICE ACTIVE • LINE {activeLineIndex + 1} OF {char.dialogue.length}</span>
                              <button 
                                onClick={stopCharacterVoice}
                                className="text-[#D4AF37] hover:underline"
                              >
                                DISMISS
                              </button>
                            </div>

                            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#0A0A0A] border-b border-r border-[#D4AF37] rotate-45" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Concept Explore Banner on Right Page */}
                {rightPage.explore && !speakingCharacter && (
                  <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center">
                    <button
                      onClick={() => {
                        sound.playGateAdd();
                        onExplore(rightPage.explore.target);
                      }}
                      className="px-5 py-2 rounded-full border border-[#D4AF37]/60 bg-[#0A0A0A]/90 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] transition-all duration-300 text-[11px] font-mono tracking-wider font-semibold flex items-center space-x-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{rightPage.explore.label}</span>
                    </button>
                  </div>
                )}

                {/* Page Number Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#0A0A0A]/85 border border-[#222222] font-mono text-[10px] text-[#8A8780]">
                  PAGE {String(currentPageIndex + 2).padStart(2, '0')}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Tactical Physical Navigation Bar */}
        <div className="w-full flex items-center justify-between mt-6 px-4">
          {/* Previous Page */}
          <button
            onClick={goToPrev}
            disabled={currentPageIndex === 0}
            className={`px-6 py-2.5 rounded-full border flex items-center space-x-2 text-xs font-mono tracking-wider transition-all ${
              currentPageIndex === 0
                ? 'border-[#1F1F1F] text-[#444444] cursor-not-allowed'
                : 'border-[#333333] hover:border-[#EAE6DF] text-[#EAE6DF] hover:bg-[#111111]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREVIOUS PAGE</span>
          </button>

          {/* Page Counter & Spread Toggle */}
          <div className="flex items-center space-x-4">
            <span className="font-mono text-xs text-[#8A8780] tracking-widest">
              PAGE {String(currentPageIndex + 1).padStart(2, '0')}
              {viewMode === 'double' && rightPage && ` - ${String(currentPageIndex + 2).padStart(2, '0')}`} / {String(totalPages).padStart(2, '0')}
            </span>

            <button
              onClick={() => setViewMode(prev => prev === 'double' ? 'single' : 'double')}
              className="p-2 rounded-full border border-[#222222] hover:border-[#444444] text-[#8A8780] hover:text-[#EAE6DF] transition-colors"
              title={viewMode === 'double' ? "Switch to Single Page Mode" : "Switch to 2-Page Spread"}
            >
              {viewMode === 'double' ? <Layers className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Next Page */}
          <button
            onClick={goToNext}
            disabled={currentPageIndex >= totalPages - (viewMode === 'double' ? 2 : 1)}
            className={`px-6 py-2.5 rounded-full border flex items-center space-x-2 text-xs font-mono tracking-wider transition-all ${
              currentPageIndex >= totalPages - (viewMode === 'double' ? 2 : 1)
                ? 'border-[#1F1F1F] text-[#444444] cursor-not-allowed'
                : 'border-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#050505] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
            }`}
          >
            <span className="hidden sm:inline">NEXT PAGE</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>
  );
}

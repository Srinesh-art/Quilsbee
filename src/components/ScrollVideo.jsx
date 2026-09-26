import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play, Pause, Sparkles } from 'lucide-react';

export default function ScrollVideo({ 
  videoSrc, 
  title, 
  subtitle, 
  chapterTag, 
  metadataTag, 
  buttonText, 
  onButtonClick, 
  id 
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted for reliable autoplay in all modern browsers
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay was blocked, will resume on scroll/interaction
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  // Scroll Timeline Scrubbing with Smooth Frame Interpolation
  useEffect(() => {
    let animId;
    let targetProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      targetProgress = Math.max(0, Math.min(1, currentScroll / totalScroll));
      setProgress(targetProgress);

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        // Scrub timeline smoothly to mapped position
        const targetTime = targetProgress * video.duration;
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.05) {
          video.currentTime += diff * 0.25;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      id={id} 
      className="relative w-full h-[260vh] bg-[#050505]"
    >
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Cinematic Video Background */}
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105 filter contrast-110 brightness-95 transition-opacity duration-1000"
          onError={() => setHasError(true)}
        />

        {/* Ambient Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/75 via-[#050505]/25 to-[#050505]/95 pointer-events-none" />
        <div className="absolute inset-0 vignette-overlay pointer-events-none" />

        {/* Foreground Cinematic Hero Box */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Micro Tag */}
          <div className="flex items-center space-x-3 mb-6 animate-pulseGlow">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="micro-label text-[#D4AF37]">
              {chapterTag || "PROLOGUE"}
            </span>
            {metadataTag && (
              <>
                <span className="text-[#444444]">•</span>
                <span className="micro-label text-[#8A8780]">{metadataTag}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-[#EAE6DF] font-light tracking-wide leading-[1.08] mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-[#8A8780] font-light max-w-xl mb-10 leading-relaxed">
            {subtitle}
          </p>

          {/* Call to Action */}
          {buttonText && (
            <button
              onClick={onButtonClick}
              className="group relative px-8 py-3.5 rounded-full border border-[#EAE6DF]/30 bg-[#0A0A0A]/80 hover:bg-[#EAE6DF] text-[#EAE6DF] hover:text-[#050505] transition-all duration-500 flex items-center space-x-3 shadow-lg hover:shadow-[0_0_30px_rgba(234,230,223,0.3)]"
            >
              <span className="tracking-[0.2em] text-xs uppercase font-medium">
                {buttonText}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#050505] transition-colors" />
            </button>
          )}

          {/* Scroll Playhead Indicator */}
          <div className="absolute -bottom-32 flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            <span className="micro-label text-[10px] text-[#8A8780] font-mono">
              SCROLL TO ADVANCE CINEMATIC ({Math.round(progress * 100)}%)
            </span>
            <div className="w-36 h-[2px] bg-[#222222] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#4ECDC4] transition-all duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <ChevronDown className="w-4 h-4 text-[#8A8780] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

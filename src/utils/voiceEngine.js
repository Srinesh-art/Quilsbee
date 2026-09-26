/**
 * THE QUANTUM WORLD - Character Voice & Audio Engine
 * Automatically handles sequential voice playback, audio file integration,
 * distinct character voice profiles, and seamless SpeechSynthesis fallback.
 */

class VoiceEngine {
  constructor() {
    this.currentAudio = null;
    this.isSpeaking = false;
    this.activeCharacterId = null;
    this.sequenceTimeout = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];

    if (this.synth) {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
      };
      loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices;
      }
    }
  }

  // Stop any currently playing audio or speech
  stop() {
    if (this.sequenceTimeout) {
      clearTimeout(this.sequenceTimeout);
      this.sequenceTimeout = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.activeCharacterId = null;
  }

  // Get tailored voice settings per character
  getCharacterVoiceConfig(charId) {
    const id = (charId || '').toLowerCase();
    
    if (id.includes('sensei')) {
      // Deep, authoritative, calm scientist mentor
      return {
        pitch: 0.85,
        rate: 0.92,
        voiceName: 'en-GB'
      };
    } else if (id.includes('qubi')) {
      // Cute, robotic, high-pitched assistant
      return {
        pitch: 1.65,
        rate: 1.15,
        voiceName: 'en-US'
      };
    } else if (id.includes('warning') || id.includes('alert') || id.includes('core')) {
      // Computerized emergency AI
      return {
        pitch: 0.72,
        rate: 1.1,
        voiceName: 'en-US'
      };
    } else {
      // Akira / Student - youthful, enthusiastic, inquisitive
      return {
        pitch: 1.15,
        rate: 1.02,
        voiceName: 'en-US'
      };
    }
  }

  // Play full sequential dialogue for a character automatically
  playDialogueSequence({
    character,
    onLineStart,
    onComplete
  }) {
    // 1. Stop any prior voice
    this.stop();

    if (!character || !character.dialogue || character.dialogue.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.isSpeaking = true;
    this.activeCharacterId = character.id;
    const config = this.getCharacterVoiceConfig(character.id);

    let currentLineIndex = 0;

    const playNextLine = () => {
      if (!this.isSpeaking || this.activeCharacterId !== character.id) return;

      if (currentLineIndex >= character.dialogue.length) {
        this.stop();
        if (onComplete) onComplete();
        return;
      }

      const text = character.dialogue[currentLineIndex];
      const audioSrc = character.audioFiles ? character.audioFiles[currentLineIndex] : null;

      if (onLineStart) {
        onLineStart(currentLineIndex, text);
      }

      // Check if custom audio file exists
      if (audioSrc) {
        this.currentAudio = new Audio(audioSrc);
        this.currentAudio.onended = () => {
          currentLineIndex++;
          this.sequenceTimeout = setTimeout(playNextLine, 300);
        };
        this.currentAudio.onerror = () => {
          // Fallback to speech synthesis if audio file not found
          this.speakText(text, config, () => {
            currentLineIndex++;
            this.sequenceTimeout = setTimeout(playNextLine, 300);
          });
        };
        this.currentAudio.play().catch(() => {
          this.speakText(text, config, () => {
            currentLineIndex++;
            this.sequenceTimeout = setTimeout(playNextLine, 300);
          });
        });
      } else {
        // High quality speech synthesis fallback
        this.speakText(text, config, () => {
          currentLineIndex++;
          this.sequenceTimeout = setTimeout(playNextLine, 300);
        });
      }
    };

    playNextLine();
  }

  speakText(text, config, onEndCallback) {
    if (!this.synth) {
      // If Web Speech not supported, simulate natural reading delay
      const words = text.split(' ').length;
      const durationMs = Math.max(1800, words * 320);
      this.sequenceTimeout = setTimeout(onEndCallback, durationMs);
      return;
    }

    // Cancel any stuck utterances
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;

    // Pick best matching English voice
    if (this.voices.length > 0) {
      const match = this.voices.find(v => 
        (config.voiceName && v.lang.includes(config.voiceName)) || v.lang.startsWith('en')
      );
      if (match) utterance.voice = match;
    }

    let hasEnded = false;
    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        onEndCallback();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Safety timeout in case browser drops onend
    const words = text.split(' ').length;
    const maxDuration = Math.max(2500, words * 500);
    const fallbackTimer = setTimeout(finish, maxDuration);

    utterance.onend = () => {
      clearTimeout(fallbackTimer);
      finish();
    };

    this.synth.speak(utterance);
  }
}

export const voiceEngine = new VoiceEngine();

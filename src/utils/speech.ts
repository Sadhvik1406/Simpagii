/**
 * Simp AGI Voice Engine (Jarvis-style Text-to-Speech)
 */
export class JarvisVoiceEngine {
  private static isMuted: boolean = false;
  private static speechSynth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  public static setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  public static getMuted(): boolean {
    return this.isMuted;
  }

  public static speak(text: string): void {
    if (this.isMuted || !this.speechSynth || typeof window === 'undefined') {
      return;
    }

    try {
      this.speechSynth.cancel(); // Stop any pending speech
      const cleanText = text.replace(/[*_#`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Prefer a cool, crisp English voice (British / American male or female assistant)
      const voices = this.speechSynth.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Oliver') || v.name.includes('Alex')) && 
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.pitch = 0.95; // Slightly deeper, calm robotic tone like Jarvis
      utterance.rate = 1.05; // Swift and articulate
      utterance.volume = 1.0;

      this.speechSynth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }
}

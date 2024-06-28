import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() responses: any[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  
  closeModal() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
    this.close.emit();
  }

  nextAction() {
    this.next.emit();
  }

  readAloud(descriptor: any) {
    const name = descriptor.name;
    const shortDesc = descriptor.short_desc;
    const longDesc = descriptor.long_desc;
    const textToRead = `Course Name: ${name}. Short Description: ${shortDesc}. Long Description: ${longDesc}.`;

    const language = this.detectLanguage(textToRead);

    if ('speechSynthesis' in window) {
      this.speakText(textToRead, language);
    } else {
      alert('Sorry, your browser does not support text to speech.');
    }
  }

  detectLanguage(text: string): string {
    // A simple heuristic to detect language based on the presence of Hindi characters
    const hindiChars = /[\u0900-\u097F]/;
    if (hindiChars.test(text)) {
      return 'hi-IN'; // Hindi
    }
    return 'en-US'; // Default to English
  }

  speakText(text: string, language: string) {
    const maxChunkLength = 100; // Define a maximum length for each chunk
    const textChunks = this.splitTextIntoChunks(text, maxChunkLength);

    let utteranceIndex = 0;

    const speakNextChunk = () => {
      if (utteranceIndex < textChunks.length) {
        const speech = new SpeechSynthesisUtterance(textChunks[utteranceIndex]);
        speech.lang = language;
        speech.onend = speakNextChunk; // Queue the next chunk when this one ends
        window.speechSynthesis.speak(speech);
        utteranceIndex++;
      }
    };

    speakNextChunk(); // Start the chain
  }

  splitTextIntoChunks(text: string, maxChunkLength: number): string[] {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = Math.min(startIndex + maxChunkLength, text.length);

      // Try to avoid breaking in the middle of a word
      if (endIndex < text.length) {
        while (endIndex > startIndex && text[endIndex] !== ' ' && text[endIndex] !== '.') {
          endIndex--;
        }
      }

      if (endIndex === startIndex) {
        endIndex = Math.min(startIndex + maxChunkLength, text.length);
      }

      chunks.push(text.substring(startIndex, endIndex).trim());
      startIndex = endIndex;
    }

    return chunks;
  }
}

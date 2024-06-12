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
      const speech = new SpeechSynthesisUtterance(textToRead);
      speech.lang = language;
      window.speechSynthesis.speak(speech);
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
}

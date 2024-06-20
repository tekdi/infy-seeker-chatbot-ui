import { Component, ViewChild, ElementRef, AfterViewChecked, Renderer2, ViewContainerRef, ComponentFactoryResolver, Inject, PLATFORM_ID } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { FlaskService } from '../services/flask.service';
import { SelectService } from '../services/select.service';
import { InitService } from '../services/init.service';
import { ConfirmService } from '../services/confirm.service';
import { ModalComponent } from '../modal/modal.component';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;

  messages: { sender: string, content: string | SafeHtml }[] = [
    { sender: 'bot', content: 'Hello! How can I help you?' }
  ];
  newMessage = '';
  recognition: any;
  isMicrophoneActive: boolean = false;
  waitingForConfirmation: boolean = false;
  courseId!: string;
  providerId!: string;
  userDetails: any;
  selectedLanguage = 'en-US'; // Default to English
  loading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private flaskService: FlaskService,
    private selectService: SelectService,
    private initService: InitService,
    private confirmService: ConfirmService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initSpeechRecognition();
    }
  }

  initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.selectedLanguage;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.newMessage = transcript;
        console.log('Voice input:', transcript);
        if (this.waitingForConfirmation) {
          this.handleConfirmationResponse(transcript.toLowerCase());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong with the voice recognition. Please try again.' });
      };
    }
  }

  onLanguageChange(event: any) {
    this.selectedLanguage = event.target.value;
    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
      console.log(`Language changed to ${this.selectedLanguage}`);
    }
  }

  startVoiceRecognition() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Starting voice recognition...');
      this.recognition.start();
    }
  }

  activateMicrophone() {
    this.isMicrophoneActive = true;
    console.log('Microphone activated');
  }

  deactivateMicrophone() {
    this.isMicrophoneActive = false;
    console.log('Microphone deactivated');
  }

  toggleMicrophone() {
    if (this.isMicrophoneActive) {
      console.log('Deactivating microphone...');
      this.deactivateMicrophone();
    } else {
      console.log('Activating microphone...');
      this.activateMicrophone();
      this.startVoiceRecognition();
    }
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ sender: 'user', content: this.newMessage });
      if (this.waitingForConfirmation) {
        this.handleConfirmationResponse(this.newMessage.toLowerCase());
      } else {
        this.getResponse();
      }
      this.newMessage = '';
    }
  }
  getResponse() {
    const userMessage = this.messages[this.messages.length - 1].content as string;
    this.loading = true; // Set loading to true before making the API call
    
    this.flaskService.postQuery(userMessage).subscribe(response => {
      this.loading = false; // Set loading to false after receiving the response
  
      if (response.status === 'success') {
        const nodeResponses = response.node_response.data.kahani_cache_dev;
        if (nodeResponses.length > 0) {
          nodeResponses.forEach((nodeResponse: any) => {
            const botMessage = this.formatResponse(nodeResponse);
            this.messages.push({ sender: 'bot', content: botMessage });
          });
          this.addEnrollEventListeners();
        } else {
          this.messages.push({ sender: 'bot', content: 'Sorry, no items are available. Please try again.' });
        }
      } else {
        this.messages.push({ sender: 'bot', content: 'Sorry, item is not available or else try to send prompt in a different way.' });
      }
    }, error => {
      this.loading = false; // Ensure loading is false even if there's an error
      this.messages.push({ sender: 'bot', content: 'Sorry, something went wrong. Please try again.' });
    });
  }
  

  formatResponse(course: any): SafeHtml {
    const htmlContent = `
      <div>
        <p><strong>Title:</strong> ${course.title}</p>
        
        <p><strong>Provider Name:</strong> ${course.provider_name}</p>
        <p><strong>Language:</strong> ${course.language}</p>
       
        <button class="enroll-button" data-course-id="${course.item_id}" data-provider-id="${course.provider_id}">More Info</button>
      </div>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  addEnrollEventListeners() {
    setTimeout(() => {
      const buttons = document.querySelectorAll('.enroll-button');
      buttons.forEach(button => {
        const courseId = button.getAttribute('data-course-id');
        const providerId = button.getAttribute('data-provider-id');
        if (courseId && providerId) {
          this.renderer.listen(button, 'click', () => this.Select(courseId, providerId));
        }
      });
    }, 0);
  }
  Select(courseId: string, providerId: string) {
    this.loading = true;
    
    this.selectService.selectCourse(courseId, providerId).subscribe(response => {
      this.loading = false;
  
      if (response && response.responses && response.responses.length > 0) {
        this.showForm(courseId, providerId);
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment confirmation failed. Please try again.' });
      }
    }, error => {
      this.loading = false;
      this.messages.push({ sender: 'bot', content: 'Enrollment confirmation failed. Please try again.' });
    });
  }

  showForm(courseId: string, providerId: string) {
    const formHtml = this.sanitizer.bypassSecurityTrustHtml(`
      <form id="user-details-form" style="display: flex; flex-direction: column; gap: 5px; background-color: #fff; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <label for="name" style="font-weight: bold;">Name:</label>
      <input type="text" id="name" name="name" style="padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
      <label for="age" style="font-weight: bold;">Age:</label>
      <input type="number" id="age" name="age" style="padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
      <label for="phone" style="font-weight: bold;">Phone:</label>
      <input type="text" id="phone" name="phone" style="padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
      <label for="email" style="font-weight: bold;">Email:</label>
      <input type="email" id="email" name="email" style="padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
      <button type="submit" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Submit</button>
    </form>
    `);
    this.messages.push({ sender: 'bot', content: 'Please fill the below details to continue' });
    this.messages.push({ sender: 'bot', content: formHtml });
    setTimeout(() => {
      const form = document.getElementById('user-details-form');
      if (form) {
        this.renderer.listen(form, 'submit', (event) => this.handleSubmit(event, courseId, providerId));
      }
    }, 0);
  }

  
handleSubmit(event: Event, courseId: string, providerId: string) {
  event.preventDefault();
  this.loading = true;
  
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  this.userDetails = {
    name: formData.get('name') as string,
    age: formData.get('age') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  this.initService.initUser(courseId, providerId, this.userDetails).subscribe(response => {
    this.loading = false;

    if (response && response.responses && response.responses.length > 0) {
      this.messages.push({ sender: 'bot', content: 'Do you want to confirm your order? (yes/no)' });
      this.waitingForConfirmation = true;
      this.courseId = courseId;
      this.providerId = providerId;
    } else {
      this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
    }
  }, error => {
    this.loading = false;
    this.messages.push({ sender: 'bot', content: 'Initialization failed. Please try again.' });
  });
}

  handleConfirmationResponse(userResponse: string) {
    this.waitingForConfirmation = false;
    if (userResponse.includes('yes')) {
      this.openModal(this.courseId, this.providerId, this.userDetails);
     
    } else if (userResponse.includes('no')) {
      this.messages.push({ sender: 'bot', content: 'Anything else you need, let me know.' });
    } else {
      this.messages.push({ sender: 'bot', content: 'I didn\'t understand. Please reply with "yes" or "no".' });
      this.waitingForConfirmation = true;
    }
  }


 openModal(courseId: string, providerId: string, userDetails: any) {
    this.loading = true;
    
    this.confirmService.confirmOrder(courseId, providerId, userDetails).subscribe(response => {
      this.loading = false;
  
      if (response && response.responses && response.responses.length > 0) {
        this.messages.push({ sender: 'bot', content: 'Enrollment confirmed successfully!' });
        this.messages.push({ sender: 'bot', content: 'Anything else you need, let me know.' });
        
        const factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
        const componentRef = this.modalContainer.createComponent(factory);
        const modalInstance = componentRef.instance as ModalComponent;
        modalInstance.responses = response.responses;
  
        modalInstance.close.subscribe(() => {
          componentRef.destroy();
        });
  
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
      }
    }, error => {
      this.loading = false;
      this.messages.push({ sender: 'bot', content: 'Enrollment failed. Please try again.' });
    });
  }
  

  

  

  confirmOrder(courseId: string, providerId: string, userDetails: any) {
    this.confirmService.confirmOrder(courseId, providerId, userDetails).subscribe(response => {
      if (response && response.responses && response.responses.length > 0) {
        this.messages.push({ sender: 'bot', content: 'Enrollment confirmed successfully!' });
        this.messages.push({ sender: 'bot', content: 'Anything else you need, let me know.' });
      } else {
        this.messages.push({ sender: 'bot', content: 'Enrollment confirmation failed. Please try again.' });
      }
    }, error => {
      this.messages.push({ sender: 'bot', content: 'Enrollment confirmation failed. Please try again.' });
    });
  }

  clearChat() {
    window.location.reload();
    this.messages = [
      { sender: 'bot', content: 'Hello! How can I help you?' }
    ];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private speechSubject = new BehaviorSubject<String>('');
  private recognition;
  /* Sert à récupérer le dernier input audio: incrémenté à chaque input vocal reconnu.
   */
  private speechResultsCounter = 0;

  constructor() {
    // @ts-ignore
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;
    this.recognition.onresult = (e) => {
      this.speechSubject.next(e.results[this.speechResultsCounter][0].transcript);
      this.speechResultsCounter++;
    };
    this.recognition.start();
  }

  listen() {
    return this.speechSubject.asObservable();
  }

}

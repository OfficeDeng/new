import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStartTime: Date = new Date();
  private lastActivityTime: Date = new Date();
  private activeStartTime: Date = new Date();
  private idleTimeout = 30000; // 30 seconds in milliseconds
  private activityTimer: any;
  private activeTimer: any;

  private sessionTimeSubject = new BehaviorSubject<string>('00:00:00');
  sessionTime$ = this.sessionTimeSubject.asObservable();

  private activeTimeSubject = new BehaviorSubject<string>('00:00:00');
  activeTime$ = this.activeTimeSubject.asObservable();

  private isIdleSubject = new BehaviorSubject<boolean>(false);
  isIdle$ = this.isIdleSubject.asObservable();

  constructor() {
    this.startSessionTimer();
    this.startActivityTimer();
    this.startActiveTimer();
  }

  private startSessionTimer() {
    setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this.sessionStartTime.getTime();
      this.sessionTimeSubject.next(this.formatTime(diff));
    }, 1000);
  }

  private startActivityTimer() {
    this.activityTimer = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - this.lastActivityTime.getTime();
      
      if (timeSinceLastActivity >= this.idleTimeout) {
        this.isIdleSubject.next(true);
        this.activeStartTime = new Date(); // Reset active time when idle
      }
    }, 1000);
  }

  private startActiveTimer() {
    this.activeTimer = setInterval(() => {
      if (!this.isIdleSubject.value) {
        const now = new Date();
        const activeTime = now.getTime() - this.activeStartTime.getTime();
        this.activeTimeSubject.next(this.formatTime(activeTime));
      }
    }, 1000);
  }

  private formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  recordActivity() {
    this.lastActivityTime = new Date();
    if (this.isIdleSubject.value) {
      this.activeStartTime = new Date(); // Reset active time when coming back from idle
    }
    this.isIdleSubject.next(false);
  }

  resetActiveTime() {
    this.lastActivityTime = new Date();
    this.activeStartTime = new Date();
    this.activeTimeSubject.next('00:00:00');
  }

  cleanup() {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
    }
    if (this.activeTimer) {
      clearInterval(this.activeTimer);
    }
  }
} 
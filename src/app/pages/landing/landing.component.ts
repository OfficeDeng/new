import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <h1>Welcome to the Assessment App</h1>
      <button (click)="navigateToTable()" class="nav-button">Go to Table Page</button>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .nav-button {
      padding: 12px 24px;
      font-size: 18px;
      background-color: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.2s, background-color 0.2s;

      &:hover {
        background-color: #357abd;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToTable() {
    this.router.navigate(['/table']);
  }
} 
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

interface TableRow {
  id: number;
  name: string;
  age: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container" [class.idle]="isIdle">
      <div class="session-info">
        <div class="timer">
          <span>Session Time: {{ sessionTime }}</span>
          <span>Active Time: {{ activeTime }}</span>
        </div>
      </div>

      <div class="table-actions">
        <button (click)="addRow()" class="action-button">Add Row</button>
        <button (click)="deleteRow()" class="action-button delete">Delete Row</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of tableData">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.age }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="isIdle" class="idle-overlay" (click)="handleActivity()">
        <div class="idle-message">
          Session is idle. Click anywhere to resume.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      padding: 20px;
      position: relative;
      min-height: 100vh;
      background-color: #f5f7fa;
    }

    .session-info {
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .timer {
      display: flex;
      justify-content: space-around;
      font-size: 18px;
      
      span {
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
      }
    }

    .table-actions {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    .action-button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
      background-color: #4a90e2;
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      &.delete {
        background-color: #dc3545;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;

      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
      }

      tr:hover {
        background-color: #f8f9fa;
      }
    }

    .idle-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    }

    .idle-message {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      font-size: 18px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class TableComponent implements OnInit, OnDestroy {
  sessionTime: string = '00:00:00';
  activeTime: string = '00:00:00';
  isIdle: boolean = false;
  tableData: TableRow[] = [];

  private firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  private lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.sessionTime$.subscribe(time => this.sessionTime = time);
    this.sessionService.activeTime$.subscribe(time => this.activeTime = time);
    this.sessionService.isIdle$.subscribe(idle => this.isIdle = idle);
    
    // Add initial rows
    for (let i = 0; i < 5; i++) {
      this.addRow();
    }
  }

  ngOnDestroy() {
    this.sessionService.cleanup();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  handleActivity() {
    this.sessionService.recordActivity();
  }

  private getRandomName(): string {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  private getRandomAge(): number {
    return Math.floor(Math.random() * (60 - 20 + 1)) + 20;
  }

  addRow() {
    const newRow: TableRow = {
      id: this.tableData.length + 1,
      name: this.getRandomName(),
      age: this.getRandomAge()
    };
    this.tableData.push(newRow);
  }

  deleteRow() {
    if (this.tableData.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.tableData.length);
      this.tableData.splice(randomIndex, 1);
      // Update IDs after deletion
      this.tableData = this.tableData.map((row, index) => ({
        ...row,
        id: index + 1
      }));
    }
  }
} 
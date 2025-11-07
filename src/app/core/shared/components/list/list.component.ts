import { Component, OnInit, OnDestroy, inject, ViewChild, ChangeDetectionStrategy, Signal } from '@angular/core';
import { Task } from '../../../models/task';
import { Subscription, Observable, startWith, map, switchMap } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { Criteria } from '../../../models/criteria';
import { FilterService } from '../../../services/filter.service';
import { AsyncPipe } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalSignalService } from '../../../services/modal-signal.service';
@Component({
  selector: 'app-list',
  imports: [AsyncPipe, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-5 mt-5">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="fw-bold text-black">Lista zadań</h1>
    <button class="btn btn-premium-add mx-3 fw-bold" (click)="openModal()">
      <span>✚</span>
      Dodaj</button>
  </div>
  <div class="row gy-3">
     @for (task of tasks$ | async; track $index) {
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card shadow-sm border-0 h-100" >
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3">
                <div>
                <h5 class="card-title mb-1 text-secondary">{{ task.name }}</h5>
                <small class="text-muted">{{ task.date }}</small>
              </div>
              <input type="checkbox"
                     class="form-check-input border-primary"
                     [checked]="task.status === 'Completed'"
                     (change)="toggleCompleted(task)">
            </div>
            <span class="badge bg-info mt-2">{{ task.status }}</span>
              <button class="btn btn-link p-0 option mr-5" 
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#desc"
                    aria-expanded="false"
                    aria-controls="desc"
                    (click)="toggleDescription($index)">
                    
              pokaż opis
            </button>
            <div [id]="'desc' + $index" class=" mt-3">
              @if(descVisible[$index]) {
              <p class="card-text text-secondary">{{ task.description }}</p>
              }
            </div>
          </div>
      </div>
    </div>
      }
  </div>
</div>
<app-modal #myModal></app-modal>

  `,
  styles: `

      @media (max-width: 768px) {
        .card {
          margin-bottom: 1rem;
        }
      }

      .option 
      {
          position: relative;
          top:-2px;
          left: 1rem;
      }

      .card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .completed h5 {
        text-decoration: line-through;
        color: #6c757d !important;
      }

      .btn-link {
        text-decoration: none;
        color: #0d6efd;
      }

      .btn-link:hover {
        text-decoration: underline;
      }

      .btn-premium-add {
          background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          transition: all 0.3s ease; 
      }

      .btn-premium-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 0.25rem rgba(41, 128, 185, 0.5); 
      }

      .btn-premium-add:focus, .btn-premium-close:active {
          box-shadow: none !important;
      }

  `
})
export class ListComponent implements OnInit, OnDestroy {
  title = 'junior-frontend-developer-task';
  private taskService = inject(TaskService);
  subscription!: Subscription;
  tasks: Task[] = [];
  protected descVisible: boolean[] = [];
  private filterService = inject(FilterService);
  filteredTasks$!: Observable<Task[]>;
  @ViewChild('myModal') myModal!: ModalComponent;
  private modalSignalService = inject(ModalSignalService);
  open: Signal<boolean> = this.modalSignalService.modalSignal$;
  tasks$: Observable<Task[]>;

  constructor() { 
      this.tasks$ = this.filterService.getCriteria().pipe(
      switchMap(criteria => this.taskService.filterTasks(criteria))
    );
    
  }

  ngOnInit() {
    const tasks$ = this.taskService.getTasks();
    const criteria$ = this.filterService.getCriteria().pipe(
      startWith({})
    );

    this.filteredTasks$ = criteria$.pipe(map((criteria: Criteria) => {
      return this.taskService.getTasks().pipe(
        map((tasks: Task[]) => {
          return tasks.filter(task => {
            let matches = true;
            if (criteria.name) {
              matches = matches && task.name.toLowerCase().includes(criteria.name.toLowerCase());
            }
            if (criteria.date) {
              matches = matches && task.date === criteria.date;
            }
            if (criteria.status) {
              matches = matches && task.status.toLowerCase() === criteria.status.toLowerCase();
            }
            return matches;
          });
        })
      );
    }),
      switchMap(tasks$ => tasks$)
    );

    this.subscription = this.filteredTasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.descVisible = new Array(this.tasks.length).fill(false);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleCompleted(task: any) {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }

  toggleDescription(index: number) {
    this.descVisible[index] = !this.descVisible[index];
  }

  openModal() {
    this.modalSignalService.setModalSignal(true);
  }

  closeModal() {
    this.myModal.close();
  }
}

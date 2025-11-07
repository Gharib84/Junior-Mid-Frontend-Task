import { Component, inject, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { Status } from '../../../models/status';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { noPastDateValidator } from '../../../validators/no.past.validator';
import { Task } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalSignalService } from '../../../services/modal-signal.service';
@Component({
  selector: 'app-create-event-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-12">
            <form [formGroup]="eventForm" (ngSubmit)="onsubmit()" class="p-4 border rounded shadow-sm bg-white">
                <div class="mb-3">
                    <label for="eventName" class="form-label text-capitalize">nazwy wydarzenia</label>
                    <input type="text" class="form-control" id="eventtName" placeholder="Nazwa wydarzenia" required formControlName="eventName">
                   @if(eventForm.get('eventName')?.touched && eventForm.get('eventName')?.invalid) {
                    <span class="text-danger small mt-2 d-block position-relative error-message ">Nazwa jest wymagana</span>
                   }
                </div>
              <div class="mb-3">
                <label for="date" class="form-label">daty</label>
                <input type="date" class="form-control" id="date" required formControlName="eventDate">
                @if(eventForm.get('eventDate')?.hasError('required') && eventForm.get('eventDate')?.touched) {
                  <span class="text-danger small mt-2 d-block position-relative error-message">Data jest wymagana</span>
                } @else if (eventForm.get('eventDate')?.hasError('noPastDate')) {
                  <span class="text-danger small mt-2 d-block position-relative error-message">Data nie może być z przeszłości</span>
                }
              </div>
                <div class="mb-4">
                    <label for="status" class="form-label text-capitalize">statusu</label>
                    <select class="form-select" id="status" required formControlName="eventStatus">
                        <option selected disabled value="">Wybierz status...</option>
                        @for (status of options; track status) {
                        <option> {{status}}</option>
                        }
                    </select>
                    @if(eventForm.get('eventStatus')?.touched && eventForm.get('eventStatus')?.invalid) {
                    <span class="text-danger small mt-2 d-block position-relative error-message ">Status jest wymagany</span>
                   }
                </div>
                <div class="mb-4">
                    <label for="description" class="form-label text-capitalize">opis wydarzenia</label>
                    <textarea class="form-control" id="description" rows="3" placeholder="Wprowadź opis wydarzenia" formControlName="eventDescription"></textarea>
                    @if(eventForm.get('eventDescription')?.touched && eventForm.get('eventDescription')?.invalid) {
                    <span class="text-danger small mt-2 d-block position-relative error-message ">Opis jest wymagany</span>
                    }
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-lg btn-gradient-dodaj" [disabled]="eventForm.invalid">
                        Dodaj
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>
  `,
  styles: `
      .btn-gradient-dodaj {
         background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
      }

    .btn-gradient-dodaj:hover {
        background-image: linear-gradient(to right, #ff4b2b 0%, #ff416c 100%);
        transform: scale(1.02);
        box-shadow: 0 5px 15px rgba(255, 75, 43, 0.4);
    }

      .btn-gradient-dodaj:focus, .btn-gradient-dodaj:active {
          box-shadow: none !important;
          outline: none !important;
      }

      .error-message
      {
        left: 0.5rem;
      }
  `
})
export class CreateEventFormComponent implements OnInit {
  protected statusOptions: Status = {
    "completed": 'Completed',
    "pending": 'Pending',
    "planned": 'Planned'
  }
  protected options = Object.values(this.statusOptions);
  private fb = inject(FormBuilder);
  eventForm!: FormGroup;
  private taskService = inject(TaskService);
  @ViewChild('myModal') myModal!: ModalComponent
  private changeDetectorRef = inject(ChangeDetectorRef)
  private isFormSubmitted: boolean = false
  tasks: Task[] = [];
  private modalSignalService = inject(ModalSignalService);

  constructor() { }


  ngOnInit(): void {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', [Validators.required, noPastDateValidator()]],
      eventStatus: ['', Validators.required],
      eventDescription: ['', Validators.required]
    });
  }

  onsubmit() {
    if (this.eventForm.valid) {
      // Handle form submission logic here
      console.log(this.eventForm.value);
      const newTask: Task = {
        name: this.eventForm.value.eventName,
        status: this.eventForm.value.eventStatus,
        date: this.eventForm.value.eventDate,
        description: this.eventForm.value.eventDescription
      };
      this.taskService.createTask(newTask);
      this.eventForm.reset();
      this.changeDetectorRef.detectChanges();
      this.eventForm.markAsPristine();
      this.isFormSubmitted = true;
      this.modalSignalService.closeModal();
    }
  }
}

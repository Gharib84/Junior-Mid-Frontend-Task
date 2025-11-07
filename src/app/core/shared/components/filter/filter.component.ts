import { Component,inject,OnInit,ChangeDetectionStrategy } from '@angular/core';
import { Status } from '../../../models/status';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Criteria } from '../../../models/criteria';
import { FilterService } from '../../../services/filter.service';
@Component({
  selector: 'app-filter',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="container mt-5">
    <form [formGroup]="filterGroup" class="p-5 border rounded-3 shadow-sm" (ngSubmit)="onSubmit()">
        <div class="row g-3 align-items-center">
            <div class="col-md-4">
                <label for="nameFilter" class="form-label  text-capitalize fw-bold mb-3"> nazwy wydarzenia</label>
                <input type="text" id="nameFilter" class="form-control" placeholder="Wpisz nazwę wydarzenia" formControlName="eventName">
            </div>
            <div class="col-md-4">
                <label for="dateFilter" class="form-label text-capitalize fw-bold mb-3">daty</label>
                <input type="date" id="dateFilter" class="form-control" placeholder="Wybierz datę" formControlName="eventDate">
            </div>
            <div class="col-md-4">
                <label for="statusFilter" class="form-label text-capitalize fw-bold mb-3">statusu</label>
                <select id="statusFilter" class="form-select" formControlName="eventStatus">
                    <option selected>Wybierz...</option>
                    @for (status of options; track status) {
                   <option> {{status}}</option>
                   }
                </select>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 d-flex justify-content-end">
                <button type="submit" class="btn btn-premium-filter fw-bold filter-btn">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel-fill me-2" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1.5A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
        </svg>
                Filter</button>
            </div>
        </div>
    </form>
</div>
  `,
  styles: `
    @media (max-width: 768px) {
      .filter-btn {
        width: 100%;
        cursor: pointer;
      }
    }

     .btn-premium-filter {
          background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          transition: all 0.3s ease; 
      }

      .btn-premium-filter:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 0.25rem rgba(41, 128, 185, 0.5); 
      }

      .btn-premium-filter:focus, .btn-premium-close:active {
          box-shadow: none !important;
      }
  `
})
export class FilterComponent implements OnInit {
  protected statusOptions: Status = {
    "completed": 'Completed',
    "pending": 'Pending',
    "planned": 'Planned'
  }
  private fb = inject(FormBuilder);
  filterGroup!:FormGroup;
  private filterService = inject(FilterService);
  protected options = Object.values(this.statusOptions);
  constructor() {}

  ngOnInit(): void {
    this.filterGroup = this.fb.group({
      eventName: new FormControl(''),
      eventDate: new FormControl(''),
      eventStatus: new FormControl('')
    });
  }


  onSubmit() {
    if (this.filterGroup.valid) {
      const criteria: Criteria = {
        name: this.filterGroup.value.eventName,
        date: this.filterGroup.value.eventDate,
        status: this.filterGroup.value.eventStatus
      };
      this.filterService.updateCriteria(criteria);
    }  
  }
}

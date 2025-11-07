import { Component,inject } from '@angular/core';
import { CreateEventFormComponent } from '../create-event-form/create-event-form.component';
import { ModalSignalService } from '../../../services/modal-signal.service';
@Component({
  selector: 'app-modal',
  imports: [CreateEventFormComponent],
  template: `
          <!-- Modal -->
      @if(isOpened()){
        <div class="overlay"></div>
          <div class="modal-box">
        <div class="modal-header">
          <h4>{{ title }}</h4>
          <button class="close-btn" (click)="close()">×</button>
        </div>

        <div class="modal-body">
          <ng-content>
            <app-create-event-form></app-create-event-form>
          </ng-content>
        </div>

        <div class="modal-footer">
          <button class="btn btn-premium-close fw-bold rounded-pill py-2 px-4 right" (click)="close()">
                      Zamknij
               </button>
        </div>
      </div>
      }

  `,
  styles: `
          .overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10;
          }

          .modal-box {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            width: 400px;
            border-radius: 8px;
            padding: 1rem;
            z-index: 11;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
          }

          .modal-header, .modal-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .close-btn {
            border: none;
            background: transparent;
            font-size: 1.5rem;
            cursor: pointer;
          }


      .btn-premium-close {
          background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          transition: all 0.3s ease; 
          position: relative;
          left: 15rem;
      }

      .btn-premium-close:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 0.25rem rgba(41, 128, 185, 0.5); 
      }

      .btn-premium-close:focus, .btn-premium-close:active {
          box-shadow: none !important;
      }

    
  `
})
export class ModalComponent {;
  title: string = 'Dodaj Nowy Wpis';
  private modalSignalService = inject(ModalSignalService);
  isOpened = this.modalSignalService.modalSignal$;



  open() {
    this.modalSignalService.setModalSignal(true);
  }

  close() {
    this.modalSignalService.closeModal();
  }
}

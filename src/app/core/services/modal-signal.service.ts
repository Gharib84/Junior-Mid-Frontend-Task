import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalSignalService {
  private modalSignal = signal(false);
  modalSignal$: Signal<boolean> = this.modalSignal.asReadonly();

  constructor() {}

  setModalSignal(value: boolean) {
    this.modalSignal.set(value);
  }

  closeModal() {
    this.modalSignal.set(false);
  }
}

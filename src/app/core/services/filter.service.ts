import { Injectable } from '@angular/core';
import { Criteria } from '../models/criteria';
import { BehaviorSubject,Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private criteriaSource = new BehaviorSubject<Criteria>({});
  currentCriteria = this.criteriaSource.asObservable();

  constructor() { }

  getCriteria(): Observable<Criteria> {
    return this.currentCriteria;
  }

  updateCriteria(criteria: Criteria): void {
    this.criteriaSource.next(criteria);
  }
}

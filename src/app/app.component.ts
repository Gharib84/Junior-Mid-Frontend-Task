import { Component } from '@angular/core';
import { FilterComponent } from './core/shared/components/filter/filter.component';
import { ListComponent } from './core/shared/components/list/list.component';
@Component({
  selector: 'app-root',
  imports: [FilterComponent, ListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  
}

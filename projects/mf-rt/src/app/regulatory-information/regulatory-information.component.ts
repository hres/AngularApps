import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-regulatory-information',
  standalone: true,
  imports: [],
  templateUrl: './regulatory-information.component.html',
  styleUrl: './regulatory-information.component.css'
})
export class RegulatoryInformationComponent {
  public regulartoryFormModel: FormGroup;
}

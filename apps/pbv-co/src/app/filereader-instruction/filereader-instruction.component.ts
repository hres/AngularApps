import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, OnInit, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { GlobalService } from '../global/global.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filereader-instruction',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './filereader-instruction.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None
})
export class FilereaderInstructionComponent implements OnChanges {
  @Input() lang: string;
  @Input() isInternal: boolean;
  @Input() isStatusFinal: boolean;

  alertVisible = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const showAlert = this.isStatusFinal && !this.isInternal;

    if (showAlert && !this.alertVisible) {
      setTimeout(() => {
        this.alertVisible = true;
        this.cdr.detectChanges(); // 👈 tells Angular to re-render
      }, 400);
    }
  }
}

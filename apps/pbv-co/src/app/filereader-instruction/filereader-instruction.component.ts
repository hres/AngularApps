import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-filereader-instruction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filereader-instruction.component.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None
})
export class FilereaderInstructionComponent implements OnInit {
  @Input() lang: string;

  isInternal: boolean;
  public showFieldErrors: boolean = false;

  constructor(
    private _globalService: GlobalService
  ) {
    this.showFieldErrors = false;
  }

  ngOnInit() {
    this.isInternal = this._globalService.isInternal;
  }
}

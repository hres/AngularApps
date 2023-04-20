import { Component, Input, OnInit } from '@angular/core';
import { InstructionService } from './instruction.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styles: [],
})
export class ContainerComponent implements OnInit {
  @Input() isInternal;
  @Input() lang;
  helpIndex: any;

  constructor(private instructionService: InstructionService) {}

  ngOnInit() {
    this.helpIndex = this.instructionService.getHelpTextIndex();
    // console.log(
    //   'ContainerComponent ~ ngOnInit ~ this.helpIndex',
    //   this.helpIndex
    // );
    // console.log('ContainerComponent ~ ngOnInit ~ this.currlang', this.lang);
  }
}

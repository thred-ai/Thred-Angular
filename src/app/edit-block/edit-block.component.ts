import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Block, Page } from 'thred-core';

@Component({
  selector: 'app-edit-block',
  templateUrl: './edit-block.component.html',
  styleUrls: ['./edit-block.component.scss']
})
export class EditBlockComponent implements OnInit {

  @Input() block!: Block
  @Input() active!: boolean
  @Input() mainFrame!: HTMLElement
  @Input() id!: string
  @Input() page!: Page
  @Input() defaultItems?: any[];


  @Output() clicked = new EventEmitter<any>();
  @Output() hoverOn = new EventEmitter<any>();
  @Output() hoverOff = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
    console.log(this.defaultItems)
  }

}

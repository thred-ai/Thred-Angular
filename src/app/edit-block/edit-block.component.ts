import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Block } from '../block.model';
import { Page } from '../page.model';

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

  @Output() clicked = new EventEmitter<any>();
  @Output() hoverOn = new EventEmitter<any>();
  @Output() hoverOff = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}

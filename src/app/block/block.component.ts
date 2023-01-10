import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Block } from '../block.model';
import { Page } from '../page.model';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {

  constructor() { }

  @Input() block!: Block
  @Input() active!: boolean
  @Input() id!: string
  @Input() page!: Page

  @Output() clicked = new EventEmitter<any>();

  ngOnInit(): void {
  }


}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor() { }
  @Input() status?: number = 0
  @Input() enabledTitle?: string = 'Enabled'
  @Input() disabledTitle?: string = 'Disabled'
  @Input() enabledText?: string = 'This item is for sale'
  @Input() disabledText?: string = 'This item is not for sale'

  ngOnInit(): void {
  }

}

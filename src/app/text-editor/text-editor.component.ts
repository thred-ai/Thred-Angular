import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventObj } from 'jodit-angular/lib/Events';
import { NgxWigComponent } from 'ngx-wig';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements OnInit {
  @Input() content: string = '';
  @Input() placeholder: string = '';

  @Output() contentChange = new EventEmitter<string>();

  buttons = '';

  buttonList = [
    'bold',
    'italic',
    'underline',
    'ul',
    'ol',
    'font',
    'fontsize',
    'lineHeight',
    'link',
    'indent',
    'source',
    'left',
    'center',
    'right',
    'brush',
    'undo',
    'redo',
  ];
  constructor() {
    this.buttons = this.buttonList.join(",")
  }

  ngOnInit(): void {}
}

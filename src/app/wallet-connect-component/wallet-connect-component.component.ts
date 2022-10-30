import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wallet-connect-component',
  templateUrl: './wallet-connect-component.component.html',
  styleUrls: ['./wallet-connect-component.component.scss'],
})
export class WalletConnectComponentComponent implements OnInit {
  @Input() savedProviders: {
    name: string;
    img: string;
    id: string;
    code: number;
  }[] = [];

  @Input() set providers(value: string[]) {
    this.savedProviders = value.map((v: string, index: number) => {
      let id = v.split('-').join('');
      return {
        name: v
          .split('-')
          .map((l) => {
            return l.charAt(0).toUpperCase() + l.slice(1);
          })
          .join(''),
        img: `assets/${id}.svg`,
        id,
        code: index,
      };
    });
  }

  @Output() selected = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}
}

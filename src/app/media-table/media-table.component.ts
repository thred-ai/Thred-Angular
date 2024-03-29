import { moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ResizedEvent } from 'angular-resize-event';
import { Media } from 'thred-core';
import { LoadService } from '../load.service';

export class SafeObjectUrl {
  url: any;
  constructor(url: string) {
    this.url = url;
  }
  get unsafeUrl() {
    return this.url;
  }
}

@Component({
  selector: 'app-media-table',
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss'],
})
export class MediaTableComponent implements OnInit {
  @Output() clicked = new EventEmitter<
    { media: Media; index: number } | undefined
  >();

  @Output() dataChanged = new EventEmitter<{data: Media[]}>();

  @ViewChild(MatTable) table!: MatTable<any>;
  data: Media[] = [];

  loading = 0;

  @Input() set media(media: Media[]) {
    this.loading = 1;
    console.log(media);
    this.dataSource = new MatTableDataSource<Media>(media);
    this.data = media ?? [];
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator1!;
      this.loading = 0; //
    }, 250);
  }

  num = 1;

  resize(event?: ResizedEvent, forceResize = false) {
    if (
      (event &&
        (event.isFirst ||
          Math.abs(event.newRect.height - event.oldRect!.height) > 0)) ||
      forceResize
    ) {
      console.log(event);
      this.loading = 3;
      setTimeout(() => {
        if (!forceResize && event) {
          this.num = Math.floor((event.newRect.height - 125) / 70);
        }
        this.dataSource = new MatTableDataSource<Media>(this.data);

        this.loading = 0; //

        this.cdr.detectChanges();

        this.dataSource!.paginator = this.paginator1!;
      }, 5);
    }
  }

  @Input() count: number = 0;
  @Input() max: number = 0;
  @Input() id?: string = undefined;

  //

  dataSource?: MatTableDataSource<Media>;

  displayedColumns2: string[] = ['image'];

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  @ViewChild(MatPaginator) paginator1?: MatPaginator;
  @ViewChild('dropzone') parent?: ElementRef<HTMLElement>;
  @ViewChild('header') header?: ElementRef<HTMLElement>;
  @ViewChild('footer') footer?: ElementRef<HTMLElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    private loadService: LoadService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  drop(event: any) {
    this.loading = 1;
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);

    this.dataChanged.emit({data: this.data})
    this.reloadTable();
  }

  acceptedTypes = '.png,.jpeg,.gif,.svg,.webp';

  public async dropped(files: any) {
    if (this.data.length >= this.max) {
      return;
    }
    for (const file of files.addedFiles) {
      var type = file.type;

      var acceptedFiles = this.acceptedTypes;
      let arrs = acceptedFiles.replace(/\./g, '').split(',');

      if (type == '') {
        arrs.forEach((t) => {
          if (file.name.indexOf(t) > -1) {
            type = t;
            return;
          }
        });
        if (type == '') {
          return;
        }
      } else {
        let match = arrs.find((j) => {
          return type.indexOf(j) > -1;
        });
        if (!match) {
          return;
        }
      }

      const unsafeUrl = await this.createBlobUrlFromEnvironmentImage(file);

      // this.activeBlock.block?.imgs.push(unsafeUrl);

      if (this.id) {
        this.loading = 1;

        let date = new Date().getTime();
        let media = new Media(
          `img_${date}.png`,
          unsafeUrl,
          file.type,
          undefined,
          date
        );

        let url = await this.loadService.updateBlockImage(
          this.id,
          `${media.date}`,
          file
        );

        const Img = new Image();

        Img.src = URL.createObjectURL(file);

        console.log('oy');
        Img.onload = () => {
          const height = Img.height;
          const width = Img.width;

          console.log(height, width);

          media.width = width;
          media.height = height;

          if (url) {
            media.url = url;
            this.data.push(media)
            this.dataChanged.emit({data: this.data});

            this.reloadTable();
          }
        };
      }
      // this.fileDisplay = safe;
    }
  }

  async remove(media: Media) {
    let index = this.data.indexOf(media);
    if (index > -1 && this.id) {
      this.data.splice(index, 1);
      this.media = JSON.parse(JSON.stringify(this.data))
      this.dataChanged.emit({data: this.data});

    }
  }

  reloadTable() {
    this.dataSource = new MatTableDataSource<Media>(this.data);

    setTimeout(() => {
      this.loading = 0; //

      this.cdr.detectChanges();

      this.dataSource!.paginator = this.paginator1!;
    }, 500);
  }

  async createBlobUrlFromEnvironmentImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const safeObjectUrl = this.createSafeObjectUrlFromArrayBuffer(arrayBuffer);
    const unsafeUrl = file.name.match(/\.(hdr)$/i)
      ? safeObjectUrl.unsafeUrl + '#.hdr'
      : safeObjectUrl.unsafeUrl;
    return unsafeUrl;
  }

  createSafeObjectURL(blob: Blob) {
    return new SafeObjectUrl(URL.createObjectURL(blob));
  }

  createSafeObjectUrlFromArrayBuffer(contents: ArrayBuffer) {
    return this.createSafeObjectURL(new Blob([new Uint8Array(contents)]));
  }

  updateBucket(type: number = 0) {}
}

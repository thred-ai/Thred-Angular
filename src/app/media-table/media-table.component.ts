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
import { LoadService } from '../load.service';
import { Media } from '../media.model';

class SafeObjectUrl {
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

  @Output() uploaded = new EventEmitter<Media[]>();

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
    // let arr = this.editableLayout?.pages[pageIndex].blocks ?? [];
    this.loading = 1;
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    // if (this.activeBlock.index == event.previousIndex) {
    //   this.activeBlock.index = event.currentIndex;
    // }
    this.reloadTable();
  }

  acceptedTypes = '.png,.jpeg,.gif';

  public async dropped(files: any) {
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
        let media = new Media(file.name, unsafeUrl, file.type);

        let url = await this.loadService.updateBlockImage(
          this.id,
          `${media.date}`,
          file
        );

        const Img = new Image();

        Img.src = URL.createObjectURL(file);

        console.log("oy")
        Img.onload = (e: any) => {
          console.log("hello")
          const height = e.path[0].height;
          const width = e.path[0].width;

          console.log(height, width);

          media.width = width
          media.height = height

          if (url) {
            media.url = url;
            this.data.push(media);
            this.uploaded.emit(this.data);
  
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
      this.loading = 1;
      let url = await this.loadService.updateBlockImage(
        this.id,
        `${media.date}`
      );
      if (!url) {
        this.data.splice(index, 1);
        this.uploaded.emit(this.data);
        this.reloadTable();
      }
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

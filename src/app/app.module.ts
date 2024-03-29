import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  ANIMATION_MODULE_TYPE,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { InViewportModule } from 'ng-in-viewport';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import {
  AngularFireFunctionsModule,
  AngularFireFunctions,
} from '@angular/fire/compat/functions';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { LazyLoadImageModule } from 'ng-lazyload-image'; // <-- include ScrollHooks
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgRouterOutletCommModule } from 'ng-router-outlet-comm';
import { AddressValidatePipe } from './address-validate.pipe';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { AddressEnsLookupPipe } from './address-ens-lookup.pipe';
import { NameEnsLookupPipe } from './name-ens-lookup.pipe';
import { IsRoutePipe } from './is-route.pipe';
import { CollectionTableComponent } from './collection-table/collection-table.component';
import { MatTableModule } from '@angular/material/table';
import { StatusComponent } from './status/status.component';
import {
  DefaultMatCalendarRangeStrategy,
  MatDatepickerModule,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { DataTableComponent } from './data-table/data-table.component';
import { LocationPipe } from './location.pipe';
import { ViewsPipe } from './views.pipe';
import { LiveEarthViewPipePipe } from './live-earth-view-pipe.pipe';
import { safeHtmlPipe } from './safeHtml.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NotificationComponent } from './notification/notification.component';
import { SmartUtilComponent } from './smart-util/smart-util.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { SafeUrlPipe } from './safe-url.pipe';
import { ViewCoordComponent } from './view-coord/view-coord.component';
import { WalletConnectComponentComponent } from './wallet-connect-component/wallet-connect-component.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutBuilderComponent } from './layout-builder/layout-builder.component';
import { VideoPipePipe } from './video-pipe.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { SafeTextRowsPipe } from './safe-text-rows.pipe';
import { nftPipe } from './nft.pipe';
import { NFTTableComponent } from './nft-table/nft-table.component';
import { MatSliderModule } from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AddNftComponent } from './add-nft/add-nft.component';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SliderValuePipe } from './slider-value.pipe';
import { LayoutsPipe } from './layouts.pipe';
import { LayoutIndexPipe } from './layout-index.pipe';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MediaTableComponent } from './media-table/media-table.component';
import { NgxDefaultImageModule } from 'ngx-default-image';
import { EditBlockComponent } from './edit-block/edit-block.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { DragBlockComponent } from './drag-block/drag-block.component';
import { LayoutSidebarComponent } from './layout-sidebar/layout-sidebar.component';
import { ThredCoreModule } from 'thred-core';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ProfileComponent } from './profile/profile.component';
import { PageListPipe } from './page-list.pipe';
// import {BUTTONS, NgxWigModule} from 'ngx-wig';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { JoditAngularModule } from 'jodit-angular';
import { AppTableComponent } from './app-table/app-table.component';
import { AddAppComponent } from './add-app/add-app.component';
import { MergeObjPipe } from './merge-obj.pipe';
import { CastPipe } from './cast.pipe';
import { LayoutSliderComponent } from './layout-slider/layout-slider.component';
import { WalletStatusPipe } from './wallet-status.pipe';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    AddressValidatePipe,
    AddressEnsLookupPipe,
    NameEnsLookupPipe,
    CollectionTableComponent,
    StatusComponent,
    DataTableComponent,
    NotificationComponent,
    IsRoutePipe,
    ViewsPipe,
    VideoPipePipe,
    LocationPipe,
    LiveEarthViewPipePipe,
    safeHtmlPipe,
    SafeUrlPipe,
    nftPipe,
    SafeTextRowsPipe,
    SmartUtilComponent,
    ProfileComponent,
    ViewCoordComponent,
    WalletConnectComponentComponent,
    LayoutBuilderComponent,
    NFTTableComponent,
    AppTableComponent,
    AddNftComponent,
    AddAppComponent,
    SharedDialogComponent,
    SliderValuePipe,
    LayoutsPipe,
    LayoutIndexPipe,
    CastPipe,
    MediaTableComponent,
    EditBlockComponent,
    EditPageComponent,
    DragBlockComponent,
    LayoutSidebarComponent,
    PageListPipe,
    TextEditorComponent,
    MergeObjPipe,
    LayoutSliderComponent,
    WalletStatusPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    DragScrollModule,
    MatDialogModule,
    MatExpansionModule,
    InViewportModule,
    HttpClientModule,
    FormsModule,
    NgxCurrencyModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatChipsModule,
    AngularFireFunctionsModule,
    VgCoreModule,
    VgControlsModule,
    VgBufferingModule,
    VgOverlayPlayModule,
    LazyLoadImageModule,
    MatSidenavModule,
    NgbModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatNativeDateModule,
    ScrollingModule,
    NgRouterOutletCommModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MatDatepickerModule,
    MatPaginatorModule,
    NgxDropzoneModule,
    DragDropModule,
    ColorPickerModule,
    NgxSliderModule,
    AngularResizeEventModule,
    NgxDefaultImageModule,
    JoditAngularModule,
    ThredCoreModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // Globals,
    // { provide: USE_FUNCTIONS_EMULATOR, useValue: !environment.production ? ['localhost', 5001] : undefined },
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' },
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    // { provide: BUTTONS, multi: true, useValue: MY_PLUGIN }
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, functions: AngularFireFunctions) {
    // functions.useEmulator('localhost', 5001)
  }
}

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
// import { Globals } from './globals';
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
// import { ApplicationPipesModule } from './shared/applicationPipes.module';
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
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgRouterOutletCommModule } from 'ng-router-outlet-comm';
import { AddressValidatePipe } from './address-validate.pipe';
import { AddressPipe } from './address.pipe';
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
import { FormatEtherPipe } from './format-ether.pipe';
import { TypeNumberPipe } from './type-number.pipe';
import { IsAdminPipe } from './is-admin.pipe';
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
import { ProfileComponent } from './profile/profile.component';
import { ViewCoordComponent } from './view-coord/view-coord.component';
import { WalletConnectComponentComponent } from './wallet-connect-component/wallet-connect-component.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutBuilderComponent } from './layout-builder/layout-builder.component';
import { VideoPipePipe } from './video-pipe.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { StoreThemePipe } from './store-theme.pipe';
import { SafeTextRowsPipe } from './safe-text-rows.pipe';
import { nftPipe } from './nft.pipe';
import { NFTTableComponent } from './nft-table/nft-table.component';
import {MatSliderModule} from '@angular/material/slider';
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { LoaderComponent } from './loader/loader.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AddNftComponent } from './add-nft/add-nft.component';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ColorShadePipe } from './color-shade.pipe';
import { SliderValuePipe } from './slider-value.pipe';
import { LayoutsPipe } from './layouts.pipe';
import { LayoutIndexPipe } from './layout-index.pipe';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MediaTableComponent } from './media-table/media-table.component';
import { GridComponent } from './grid/grid.component';
import { GridItemComponent } from './grid-item/grid-item.component';
import { NgxDefaultImageModule } from "ngx-default-image";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    DashboardComponent,
    SearchBarComponent,
    AddressValidatePipe,
    AddressPipe,
    AddressEnsLookupPipe,
    NameEnsLookupPipe,
    FormatEtherPipe,
    TypeNumberPipe,
    CollectionTableComponent,
    StatusComponent,
    DataTableComponent,
    NotificationComponent,
    IsAdminPipe,
    ViewsPipe,
    VideoPipePipe,
    LocationPipe,
    LiveEarthViewPipePipe,
    safeHtmlPipe,
    SafeUrlPipe,
    nftPipe,
    StoreThemePipe,
    SafeTextRowsPipe,
    SmartUtilComponent,
    ProfileComponent,
    ViewCoordComponent,
    WalletConnectComponentComponent,
    LayoutBuilderComponent,
    NFTTableComponent,
    LoaderComponent,
    AddNftComponent,
    SharedDialogComponent,
    ColorShadePipe,
    SliderValuePipe,
    LayoutsPipe,
    LayoutIndexPipe,
    MediaTableComponent,
    GridComponent,
    GridItemComponent
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
    NgxDefaultImageModule
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, functions: AngularFireFunctions) {
    // functions.useEmulator('localhost', 5001)
  }
}

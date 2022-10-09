import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
// import { Globals } from './globals';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ItemComponent } from './item/item.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FeaturedComponent } from './featured/featured.component';
import { SectionComponent } from './section/section.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemComponent,
    AuthComponent,
    DashboardComponent,
    CategoryComponent,
    SearchBarComponent,
    FeaturedComponent,
    SectionComponent,
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
    MatSnackBarModule,
    DragScrollModule,
    MatDialogModule,
    InViewportModule,
    HttpClientModule,
    // ApplicationPipesModule,
    AngularFireFunctionsModule,
    VgCoreModule,
    VgControlsModule,
    VgBufferingModule,
    VgOverlayPlayModule,
    LazyLoadImageModule,
    MatSidenavModule,
    NgbModule,
    MatTabsModule,
    MatNativeDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    // Globals,
    // { provide: USE_FUNCTIONS_EMULATOR, useValue: !environment.production ? ['localhost', 5001] : undefined },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router, functions: AngularFireFunctions) {
    // functions.useEmulator('localhost', 5001)
  }
}

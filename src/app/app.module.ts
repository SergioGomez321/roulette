import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RuletaComponent } from './components/ruleta/ruleta.component';
import { MaterializeButtonModule, MaterializeCardModule, MaterializeCollapsibleModule, MaterializeDrawerModule, MaterializeInputModule } from 'materialize-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    RuletaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterializeButtonModule,
    MaterializeCardModule,
    MaterializeInputModule,
    FormsModule,
    MaterializeDrawerModule,
    MaterializeCollapsibleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

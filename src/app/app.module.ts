import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireModule,  
    AngularFireStorage
  ],
  providers: [
    AngularFireDatabase,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.firebase.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideFirestore(() => {
        const firestore = getFirestore();
        if (environment.firebase.emulator) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;

      }),
        provideStorage(() => {
          const storage = getStorage();
          if (environment.firebase?.emulator) {
            connectStorageEmulator(storage, 'localhost', 9199);
          }
          return storage;
        }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

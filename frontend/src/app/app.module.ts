import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AlbumsComponent } from './albums/albums.component';
import { HttpClientModule } from '@angular/common/http';
import { AlbumComponent } from './album/album.component';
import { AddAlbumComponent } from './add-album/add-album.component';
import { FormsModule } from '@angular/forms';
import { EditAlbumComponent } from './edit-album/edit-album.component';
import { AddSongComponent } from './add-song/add-song.component';
import { EditSongComponent } from './edit-song/edit-song.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JoinPipe } from './_pipes/join.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
    AlbumComponent,
    AddAlbumComponent,
    EditAlbumComponent,
    AddSongComponent,
    EditSongComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    PageNotFoundComponent,
    JoinPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'albums',
        pathMatch: 'full'
      },
      {
        path: 'albums',
        component: AlbumsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'add_album',
        component: AddAlbumComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'albums/:albumId',
        component: AlbumComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit_album/:albumId',
        component: EditAlbumComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'albums/:albumId/add_song',
        component: AddSongComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'albums/:albumId/edit_song/:songId',
        component: EditSongComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'page-not-found',
        component: PageNotFoundComponent
      },
      {
        path: '**',
        redirectTo: 'page-not-found'
      }
    ]),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

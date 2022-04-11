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

@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
    AlbumComponent,
    AddAlbumComponent,
    EditAlbumComponent,
    AddSongComponent,
    EditSongComponent,
    HeaderComponent
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
        component: AlbumsComponent
      },
      {
        path: 'add_album',
        component: AddAlbumComponent
      },
      {
        path: 'albums/:albumId',
        component: AlbumComponent
      },
      {
        path: 'edit_album/:albumId',
        component: EditAlbumComponent
      },
      {
        path: 'albums/:albumId/add_song',
        component: AddSongComponent
      },
      {
        path: 'albums/:albumId/edit_song/:songId',
        component: EditSongComponent
      }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

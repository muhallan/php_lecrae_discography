import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlbumsService } from '../_services/albums.service';
import { Album } from '../_models/album';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  constructor(private albumService: AlbumsService, private _router: Router) { }

  enableSearch = true;
  search_text = '';
  empty_message = 'No albums found. Please add some.';
  albums: Album[] = [];

  ngOnInit(): void {
    this.fetchAlbums();
  }

  fetchAlbums() {
    this.albumService.getAlbums(this.search_text)
      .then(albumsJson => {
        this.albums = albumsJson.albums
      })
      .catch(err => console.log(err));
  }

  addAlbum(): void {
    this._router.navigate(['add_album']);
  }

  confirmDelete(id: string) {
    if (confirm("Do you want to delete this album?")) {
      this.albumService.deleteAlbum(id)
      .then(result => {
        this.fetchAlbums();
      })
      .catch(err => console.log(err));
    }

  }

  editAlbum(album: Album) {
    this.albumService.setAlbumToEdit(album);
    this._router.navigate(['edit_album/' + album._id]);
  }

  searchAlbums(query: string) {
    this.search_text = query;
    this.albumService.getAlbums(this.search_text)
      .then(albumsJson => this.albums = albumsJson.albums)
      .catch(err => console.log(err));
  }
}

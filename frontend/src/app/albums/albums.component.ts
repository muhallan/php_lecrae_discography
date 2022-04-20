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

  count: number = 5;
  offset: number = 0;
  isLastPage = false;

  ngOnInit(): void {
    this.fetchAlbums();
  }

  fetchAlbums() {
    this.albumService.getAlbums(this.search_text, this.offset, this.count)
      .then(albumsJson => {
        this.albums = albumsJson.albums
        if (this.albums.length < this.count) {
          this.isLastPage = true;
        } else {
          this.isLastPage = false;
        }
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
    this.offset = 0;
    this.fetchAlbums();
  }

  getPreviousAlbums() {
    let newOffset = this.offset - this.count;
    if (newOffset < 0) {
      newOffset = 0;
    }
    this.offset = newOffset;
    this.fetchAlbums();
  }

  getNextAlbums() {
    let newOffset = this.offset + this.count;
    this.offset = newOffset;
    this.fetchAlbums();
  }

  getPageLimit(limit: number) {
    this.count = limit;
    this.offset = 0;
    this.fetchAlbums();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
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

    // this.albums.push(new Album("1", "After the Music stops", 2006));
    // this.albums.push(new Album("2", "Anomaly", 2008));
    // this.albums.push(new Album("3", "Rehab", 2009));
    // this.albums.push(new Album("4", "Church Clothes", 2010));
    this.fetchAlbums();
  }

  fetchAlbums() {
    this.albumService.getAlbums(this.search_text).subscribe({
      next: albumsJson => {
        this.albums = albumsJson.albums
      },
      error: err => console.log(err)
    });
  }

  addAlbum(): void {
    this._router.navigate(['add_album']);
  }

  confirmDelete(id: string) {
    console.log("clicked delete");
    if (confirm("Do you want to delete this album?")) {
      this.albumService.deleteAlbum(id).subscribe(result => {
        this.fetchAlbums();
      });
    }

  }

  editAlbum(album: Album) {
    this.albumService.setAlbumToEdit(album);
    this._router.navigate(['edit_album/' + album._id]);
  }

  searchAlbums(query: string) {
    this.search_text = query;
    console.log("q", query);
    this.albumService.getAlbums(this.search_text).subscribe({
      next: albumsJson => this.albums = albumsJson.albums,
      error: err => console.log(err)
    })
  }
}

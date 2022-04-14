import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css']
})
export class AddAlbumComponent implements OnInit {

  album = {
    title: '',
    year: ''
  }
  enableSearch = false;

  constructor(private albumsService: AlbumsService) { }

  ngOnInit(): void {
  }

  addAlbum() {
    this.albumsService.createAlbum(this.album)
      .then((album) => console.log(album))
      .catch(err => console.log(err));
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }
}

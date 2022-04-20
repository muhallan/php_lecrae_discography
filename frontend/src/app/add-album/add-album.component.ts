import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AlbumsService } from '../_services/albums.service';

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

  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  constructor(private albumsService: AlbumsService) { }

  ngOnInit(): void {
  }

  addAlbum(albumForm: NgForm) {
    this.albumsService.createAlbum(this.album)
      .then((album) => {
        this.hasSuccess = true;
        this.errorMessage = '';
        this.hasError = false;

        albumForm.reset();
      })
      .catch(err => {
        const body = JSON.parse(err._body);
        const message = body.message;

        this.errorMessage = message;
        this.hasError = true;
        this.hasSuccess = false;
      });
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }
}

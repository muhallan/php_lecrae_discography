import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private albumsService: AlbumsService, private router: Router) { }

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
      .catch((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['page-not-found'])
        } else {
          this.hasError = true;
          this.errorMessage = error.error.message;
          this.hasSuccess = false;
        }
      });
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }
}

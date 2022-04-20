import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../_services/albums.service';
import { Album } from '../_models/album';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})
export class EditAlbumComponent implements OnInit {

  album: Album = new Album("", "", 0);
  enableSearch = false;

  successMessage: string = '';
  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;
  
  constructor(private router: Router, private albumService: AlbumsService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.album = this.albumService.getAlbumToEdit();
    const id = this._route.snapshot.params['albumId'];
    if (this.album._id == '') {
      this.albumService.getAlbum(id)
        .then(album => this.album = album)
        .catch((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['page-not-found'])
          } else {
            this.hasError = true;
            this.errorMessage = error.error.message;
            this.hasSuccess = false;
            this.successMessage = '';
          }
        });
    }
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }

  editAlbum() {
    this.albumService.editAlbum(this.album)
      .then((album) => {
        this.router.navigate(['albums']);
      })
      .catch((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['page-not-found'])
        } else {
          this.hasError = true;
          this.errorMessage = error.error.message;
          this.hasSuccess = false;
          this.successMessage = '';
        }
      });
  }
}

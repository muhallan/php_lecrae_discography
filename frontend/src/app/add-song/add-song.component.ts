import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../_services/albums.service';
import { Album } from '../_models/album';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  song = {
    name: '',
    writers: ''
  }

  constructor(private _route: ActivatedRoute, private albumService: AlbumsService, private router: Router) { }

  albumId: string = '';
  albumToEdit: Album = new Album("", "", 0);
  successfulAdd: boolean = false;
  enableSearch = false;

  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  ngOnInit(): void {
    this.albumId = this._route.snapshot.params['albumId'];
    this.albumToEdit = this.albumService.getAlbumToEdit();
    if (this.albumToEdit._id === '') {
      this.albumService.getAlbum(this.albumId)
        .then(album => this.albumToEdit = album)
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
  }

  addSong(songForm: NgForm) {
    this.successfulAdd = false;
    const writers = this.song.writers.split(",");
    const songData = {
      name: this.song.name,
      writers: writers
    }
    this.albumService.addSong(this.albumId, songData)
      .then((songs) => {
        this.hasSuccess = true;
        this.errorMessage = '';
        this.hasError = false;

        songForm.reset();
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

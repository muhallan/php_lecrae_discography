import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../_services/albums.service';
import { Album } from '../_models/album';
import { Song } from '../_models/song';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.css']
})
export class EditSongComponent implements OnInit {

  song = {
    name: '',
    writers: ''
  }

  constructor(private _route: ActivatedRoute, private albumService: AlbumsService, private router: Router) { }

  albumId: string = '';
  songId: string = '';
  albumToEdit: Album = new Album("", "", 0);
  songToEdit: Song = new Song("", "", []);
  enableSearch = false;

  successMessage: string = '';
  errorMessage: string = '';
  hasSuccess: boolean = false;
  hasError: boolean = false;

  ngOnInit(): void {
    this.albumId = this._route.snapshot.params['albumId'];
    this.songId = this._route.snapshot.params['songId'];
    this.albumToEdit = this.albumService.getAlbumToEdit();
    this.songToEdit = this.albumService.getSongToEdit();
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
            this.successMessage = '';
          }
        });
    }
    if (this.songToEdit._id === '') {
      this.albumService.getSong(this.albumId, this.songId)
        .then(song => {
          this.songToEdit = song;

          this.song.name = this.songToEdit.name;
          this.song.writers = this.songToEdit.writers.join(", ");
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
    this.song.name = this.songToEdit.name;
    this.song.writers = this.songToEdit.writers.join(", ");
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }

  editSong() {
    const writers = this.song.writers.split(",");
    const songData = {
      name: this.song.name,
      writers: writers
    }
    this.albumService.editSong(songData, this.albumId, this.songId)
      .then(song => {
        this.router.navigate(['albums/' + this.albumId]);
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

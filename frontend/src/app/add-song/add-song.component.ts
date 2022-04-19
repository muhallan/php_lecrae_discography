import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../_services/albums.service';
import { Album } from '../_models/album';

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

  constructor(private _route: ActivatedRoute, private albumService: AlbumsService) { }

  albumId: string = '';
  albumToEdit: Album = new Album("", "", 0);
  successfulAdd: boolean = false;
  enableSearch = false;

  ngOnInit(): void {
    this.albumId = this._route.snapshot.params['albumId'];
    this.albumToEdit = this.albumService.getAlbumToEdit();
    if (this.albumToEdit._id === '') {
      this.albumService.getAlbum(this.albumId)
        .then(album => this.albumToEdit = album)
        .catch(err => console.log(err));
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
        this.successfulAdd = true;
        songForm.reset();
      })
      .catch(err => console.log(err));
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }
}

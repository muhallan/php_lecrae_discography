import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../_models/album';
import { Song } from '../_models/song';

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

  ngOnInit(): void {
    this.albumId = this._route.snapshot.params['albumId'];
    this.songId = this._route.snapshot.params['songId'];
    this.albumToEdit = this.albumService.getAlbumToEdit();
    this.songToEdit = this.albumService.getSongToEdit();
    if (this.albumToEdit._id === '') {
      this.albumService.getAlbum(this.albumId)
        .then(album => this.albumToEdit = album)
        .catch(err => console.log(err));
    }
    if (this.songToEdit._id === '') {
      this.albumService.getSong(this.albumId, this.songId)
        .then(song => this.songToEdit = song)
        .catch(err => console.log(err));
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
      .catch(err => console.log(err));
  }
}

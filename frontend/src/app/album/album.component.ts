import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../_models/album';
import { Song } from '../_models/song';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  constructor(private albumService: AlbumsService, private _route: ActivatedRoute, private router: Router) { }

  album: Album = new Album("", "" ,0);
  songs: Song[] = [];
  calcIndex: number = 0;
  enableSearch = false;

  ngOnInit(): void {
    const id = this._route.snapshot.params['albumId'];
    this.fetchAlbum(id);
  }

  fetchAlbum(id: string) {
    this.albumService.getAlbum(id).subscribe(
      {
        next: album => {
          this.album = album;
          this.songs = album.songs;
        },
        error: error => console.log(error)
      }
    );
  }

  confirmDeleteSong(songId: string) {
    if (confirm("Do you want to delete this song?")) {
      this.albumService.deleteSong(this.album._id, songId).subscribe(result => {
        this.fetchAlbum(this.album._id);
      });
    }
  }

  editSong(song: Song) {
    this.albumService.setSongToEdit(song);
    this.albumService.setAlbumToEdit(this.album);
    this.router.navigate(['albums/' + this.album._id + "/edit_song/" + song._id]);
  }

  onBack(): void {
    this.router.navigate(['albums']);
  }

  addSong(id: string) {
    this.albumService.setAlbumToEdit(this.album);
    this.router.navigate(['albums/'+ id + '/add_song']);
  }
}

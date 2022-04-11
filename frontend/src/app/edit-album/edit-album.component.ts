import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { Album } from '../_models/album';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})
export class EditAlbumComponent implements OnInit {

  album: Album = new Album("", "", 0);
  enableSearch = false;
  
  constructor(private router: Router, private albumService: AlbumsService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.album = this.albumService.getAlbumToEdit();
    const id = this._route.snapshot.params['albumId'];
    if (this.album._id == '') {
      this.albumService.getAlbum(id).subscribe(album => this.album = album);
    }
  }

  isFieldValid(field: NgModel | null) {
    return field && field.invalid && (field.dirty || field.touched);
  }

  editAlbum() {
    this.albumService.editAlbum(this.album).subscribe({
      next: (album) => {
        this.router.navigate(['albums']);
      },
      error: (err) => console.log(err) 
    });
  }
}

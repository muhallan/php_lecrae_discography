import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Album, AlbumJSONResponse } from './_models/album';
import { Song } from './_models/song';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  private albumsUrl = environment.apiRoot + "albums";

  private albumToEdit: Album = new Album("", "", 0);
  private songToEdit: Song = new Song("", "", []);

  constructor(private http: HttpClient) { }

  public getAlbums(query: string): Observable<AlbumJSONResponse> {
    return this.http.get<AlbumJSONResponse>(this.albumsUrl + '?q=' + query);
  }

  public getAlbum(id: string): Observable<Album> {
    return this.http.get<Album>(this.albumsUrl + "/" + id);
  }

  public createAlbum(album: Object): Observable<Album> {
    return this.http.post<Album>(this.albumsUrl, album, this.getHeaders());
  }

  private getHeaders() {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    };
    return options;
  }

  public setAlbumToEdit(album: Album) {
    this.albumToEdit = album;
  }

  public getAlbumToEdit(): Album {
    return this.albumToEdit;
  }

  public editAlbum(album: Album): Observable<Album> {
    const data = {
      title: album.title,
      year: album.year
    };
    return this.http.patch<Album>(this.albumsUrl + "/" + album._id, data, this.getHeaders());
  }

  public addSong(albumId: string, songData: Object): Observable<Song[]> {
    const url = this.albumsUrl + '/' + albumId + '/songs';
    return this.http.post<Song[]>(url, songData, this.getHeaders());
  }

  public setSongToEdit(song: Song) {
    this.songToEdit = song;
  }

  public getSongToEdit(): Song {
    return this.songToEdit;
  }

  public getSong(albumId: string, songId: string): Observable<Song> {
    const url = this.albumsUrl + '/' + albumId + '/songs/' + songId;
    return this.http.get<Song>(url);
  }

  public editSong(songData: Object, albumId: string, songId: string): Observable<Song> {
    const url = this.albumsUrl + '/' + albumId + '/songs/' + songId;
    return this.http.put<Song>(url, songData, this.getHeaders());
  }

  public deleteAlbum(id: string): Observable<any> {
    return this.http.delete(this.albumsUrl + '/' + id);
  }

  public deleteSong(albumId: string, songId: string): Observable<any> {
    const url = this.albumsUrl + '/' + albumId + '/songs/' + songId;
    return this.http.delete(url);
  }

}

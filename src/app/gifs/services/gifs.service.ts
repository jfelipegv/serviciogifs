import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

 gifsList: Gif[] = [];

  private _tagsHistory : string[] = [];
  private apiKey:     string = 'uYOlBwumZ8ygkImsi4g2Tr4H6PipQ3HJ';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) { 
    this.loadLocalStorage();
    if(this._tagsHistory.length===0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  get tagHistory(){
    return [...this._tagsHistory];
  }

  private saveLocalStorage(): void{
    localStorage.setItem('history', JSON.stringify(this.tagHistory));
  }

  private loadLocalStorage(): void{
    if( !localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  
  }

  private organizedHisotry(tag: string) {
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagHistory.splice(0,10);
    this.saveLocalStorage();
  }

  searchTag( tag: string): void{
    if(tag.length === 0) return;

    this.organizedHisotry(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
     .subscribe( respuesta => {

      this.gifsList = respuesta.data;
     })
  }
}

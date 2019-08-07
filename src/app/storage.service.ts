import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private angularFireStorage:AngularFireStorage,) { }
  saveToDBStorage(file){
    const filePath ="product_images/"+ new Date().getTime() + file.name ;
    const ref = this.angularFireStorage.ref(filePath)
    return this.angularFireStorage.upload(filePath,file).snapshotChanges().pipe(finalize(()=>{
      return ref.getDownloadURL().subscribe(url => url)
    }))
  }
}

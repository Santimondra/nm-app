
import { observable, action, computed, extendObservable } from 'mobx';
import db from '../../config/firebaseConfig';

import { KeyboardEvent } from "react";

class FsActionStore {

    @observable arrayFolders: any = [];

    @observable arrayFoldersBackUp: any = [];

    @observable arrayArchive: any = [];

    @observable arrayArchiveBackUp: any = [];

    @observable nameFilter: string = "";

    @observable nameFilterArchive: string = "";

    @observable folderIDFilterArchive: string = "";

    @observable favoritedArchive: boolean = false;

    @observable counter: number = 0;

    @action handleNameFilter(nameFilter: string) {
        this.nameFilter = nameFilter;
        console.log(this.nameFilter, "ChangeName");
    }

    @action handleNameArchive(nameFilterArchive: string) {
        this.nameFilterArchive = nameFilterArchive;
        console.log(this.nameFilterArchive, "ChangeNameArchive");
    }

    @action handleFolderIDArchive(folderIDFilterArchive: string) {
        this.folderIDFilterArchive = folderIDFilterArchive;
        console.log(this.folderIDFilterArchive, "ChangeFolderIDArchive");
    }

    @action handleFavoritedArchive(favoritedArchive: boolean) {
        this.favoritedArchive = favoritedArchive;
        console.log(this.favoritedArchive, "ChangeFavoritedArchive");
    }

    @action cleanList() {
        this.arrayFolders = [];
        this.arrayArchive = [];
    }

    @action read() {
        this.cleanList();

        let ref = db.collection("Folders");//ruta        
        ref.get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                let element = {
                    name: doc.data().name,
                    description: doc.data().description,
                    favorited: doc.data().favorited,
                    tagnames: doc.data().tagnames,
                    id: doc.id
                };
                this.arrayFolders.push(element);
                this.arrayFoldersBackUp = this.arrayFolders;
            });
        });

        let refArchive = db.collection("Archives");//ruta        
        refArchive.get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                let element = {
                    name: doc.data().name,
                    description: doc.data().description,
                    favorited: doc.data().favorited,
                    tagnames: doc.data().tagnames,
                    id: doc.id,
                    idFolder: doc.data().IDFolder,
                    idArchive: doc.data().IDArchive,
                    size: "O MB",
                    upDate: "Sin Fecha",
                    modDate: "Sin Fecha",
                    IDD: "001"
                };
                this.arrayArchive.push(element);
                this.arrayArchiveBackUp = this.arrayArchive;
            });
        });

    }

    @action getFromLocalStore(element: string) {
        localStorage.setItem(element, JSON.stringify(this.arrayFolders));
        return JSON.parse(localStorage.getItem(element))
    }

    @action getFromLocalStoreArchive(element: string) {
        localStorage.setItem(element, JSON.stringify(this.arrayArchive));
        return JSON.parse(localStorage.getItem(element))
    }

    @action filterName() {

        if (this.arrayFolders.some((e: any) => {
            return e.name.toLowerCase() == this.nameFilter.toLowerCase();
        })) {
            this.arrayFolders = this.arrayFolders.filter((e: any) => {
                return e.name.toLowerCase() == this.nameFilter.toLowerCase();
            });
        } else {
            console.log("This is not filtering");
            this.arrayFolders = this.arrayFoldersBackUp;
        }
    }

    //some filter methods doesnt need to redefine the array to backup, 
    //in order to make the filter works with the archives of each folder, not all the db

    @action filterNameArchive() {

        if (this.arrayArchive.some((e: any) => {
            return e.name.toLowerCase() == this.nameFilterArchive.toLowerCase();
        })) {
            this.arrayArchive = this.arrayArchive.filter((e: any) => {
                return e.name.toLowerCase() == this.nameFilterArchive.toLowerCase();
            });
        } else {
            console.log("This is not filtering");
            this.arrayArchive = this.arrayArchiveBackUp;
        }
    }

    @action filterFavoritedArchive() {
        
        if (this.arrayArchive != null) {

        //the filter only works if the boolean is true
            if (this.arrayArchive.some((e: any) => {
                return e.favorited == this.filterFavoritedArchive;
            })) {
                this.arrayArchive = this.arrayArchive.filter((e: any) => {
                    return e.favorited == this.filterFavoritedArchive;
                });
            } else {
                console.log("This is not filtering Favorited");
                //this.arrayArchive = null;

                //if is not favorite, reset the actual folder's archives
                this.filterFolderIDArchive();
            }
        }
    }

    @action filterFolderIDArchive() {

        this.arrayArchive = this.arrayArchiveBackUp;

        if (this.arrayArchive.some((e: any) => {
            return e.idFolder.toLowerCase() == this.folderIDFilterArchive.toLowerCase();
        })) {
            this.arrayArchive = this.arrayArchive.filter((e: any) => {
                return e.idFolder.toLowerCase() == this.folderIDFilterArchive.toLowerCase();
            });
        } else {
            console.log("This is not filtering");
            this.arrayArchive = null;
        }
    }

    @action sortByName(order: number) {

        function compareDescendente(a: any, b: any, order1: number, order2: number) {
            if (a.name[0] < b.name[0])
                return -1;
            if (a.name[0] > b.name[0])
                return 1;
            return 0;
        }
        function compareAscendente(a: any, b: any, order1: number, order2: number) {
            if (a.name[0] < b.name[0])
                return 1;
            if (a.name[0] > b.name[0])
                return -1;
            return 0;
        }

        if (this.arrayFolders != null) {
            if (order == 0) {
                this.arrayFolders.replace(this.arrayFolders.slice().sort(compareAscendente));
            }
            if (order == 1) {
                this.arrayFolders.replace(this.arrayFolders.slice().sort(compareDescendente));
            }
        }

    }

    @action sortArchivesByName(order: boolean) {
        //console.log(this.arrayArchive[0], "Antes de sort Archive");

        function compareDescendente(a: any, b: any, order1: number, order2: number) {
            if (a.name[0] < b.name[0])
                return -1;
            if (a.name[0] > b.name[0])
                return 1;
            return 0;
        }
        function compareAscendente(a: any, b: any, order1: number, order2: number) {
            if (a.name[0] < b.name[0])
                return 1;
            if (a.name[0] > b.name[0])
                return -1;
            return 0;
        }

        if (this.arrayArchive != null) {
            if (order) {
                this.arrayArchive.replace(this.arrayArchive.slice().sort(compareAscendente));
            }
            if (!order) {
                this.arrayArchive.replace(this.arrayArchive.slice().sort(compareDescendente));
            }
        }

        //console.log(this.arrayArchive[0], "Despues de sort Archives");

    }

    @action sortArchivesBySize(order: boolean) {
        //console.log(this.arrayArchive[0], "Antes de sort Archive");

        function compareDescendente(a: any, b: any, order1: number, order2: number) {
            if (a.size[0] < b.size[0])
                return -1;
            if (a.size[0] > b.size[0])
                return 1;
            return 0;
        }
        function compareAscendente(a: any, b: any, order1: number, order2: number) {
            if (a.size[0] < b.size[0])
                return 1;
            if (a.size[0] > b.size[0])
                return -1;
            return 0;
        }

        if (this.arrayArchive != null) {
            if (order) {
                this.arrayArchive.replace(this.arrayArchive.slice().sort(compareAscendente));
            }
            if (!order) {
                this.arrayArchive.replace(this.arrayArchive.slice().sort(compareDescendente));
            }
        }

        //console.log(this.arrayArchive[0], "Despues de sort Archives");

    }

}

export const firebaseStore = new FsActionStore();
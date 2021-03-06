import { Component, Inject, AfterViewInit} from 'angular2/core';

import { BaseComponent } from '../components/Base.component';
import { ServerAPI} from '../services/ServerAPI.service';
import { LikeSvc } from '../services/Like.service';
import { SelectedPersonDirective} from '../directives/SelectedPerson.directive';
import { Person} from '../models/Person';
import { RadioControlValueAccessor} from "../directives/radio_value_accessor";
import { FORM_DIRECTIVES} from "angular2/common";
import { Router, RouteParams } from 'angular2/router';
import { ModalConfirmSvc} from '../common/ModalConfirmAll';

@Component({
    selector: 'likes',
    templateUrl: '../app/templates/likes.html',
    directives: [SelectedPersonDirective, FORM_DIRECTIVES, RadioControlValueAccessor],
    providers: [LikeSvc]
})
export class Likes extends BaseComponent implements AfterViewInit {

    private _selectedDude: Person;
    private _likesData;
    private _dislikesData;

    LikeCategory = {
        Animal: 50,
        Beverage: 100,
        Book: 200,
        Food: 300,
        Game: 400,
        Hobby: 500,
        Jewelry: 550,
        Movie: 600,
        Music: 700,
        Place: 725,
        Plant: 750,
        Show: 800,
        Sport: 900,
        Store: 1000,
        Vehicle: 1100,
        Other: 9999999
    }

    likesProps = [];

    editTypeOfLike: string;
    isEditLikes = true;
    likeIndex = 0;

    areLikesEmpty = false;
    areDislikesEmpty = false;

    addTypeLike;
    origEditType: string;
    isAddLike = true;

    inEditMode = false;

    constructor(
        @Inject(ServerAPI) private _serverAPI,
        private _likeSvc: LikeSvc,
        private _routeParams: RouteParams,
        private _modalService: ModalConfirmSvc) {

        super();

        let instanceId = this._routeParams.get('instanceId');

        if (!instanceId) {
            alert(`No instanceId provided ... try entering one in the url, like so: http://localhost:3000/Identity?instanceId=22fcf440-d3d5-e511-8d7c-a0b3cc47d18e`);
        }

        for (let prop in this.LikeCategory) {

            let icon = '';
            switch (prop) {
                case 'Animal':
                    icon = 'fa-paw'
                    break;
                case 'Plant':
                    icon = 'fa-leaf'
                    break;
                case 'Place':
                    icon = 'fa-map-marker'
                    break;
                case 'Jewelry':
                    icon = 'fa-diamond'
                    break;
                case 'Food':
                    icon = 'fa-cutlery'
                    break;
                case 'Music':
                    icon = 'fa-music'
                    break;
                case 'Store':
                    icon = 'fa-shopping-cart'
                    break;
                case 'Vehicles':
                    icon = 'fa-car'
                    break;
                case 'Book':
                    icon = 'fa-book'
                    break;
                case 'Beverage':
                    icon = 'fa-glass'
                    break;
                case 'Movie':
                    icon = 'fa-film'
                    break;
                case 'Show':
                    icon = 'fa-television'
                    break;
                case 'Sport':
                    icon = 'fa-futbol-o'
                    break;
                case 'Game':
                    icon = 'fa-gamepad'
                    break;
                case 'Hobby':
                    icon = 'fa-bicycle'
                    break;
                case 'Other':
                    icon = 'fa-circle-o'
                    break;
            }
            this.likesProps.push({ prop: prop, icon: icon });
        }

        var self = this;

        _serverAPI.getPersonByInstanceId(instanceId).subscribe(p => {
            self._selectedDude = p;

            var l = {
                Animal: [],
                Beverage: [],
                Book: [],
                Food: [],
                Jewelry: [],
                Game: [],
                Hobby: [],
                Movie: [],
                Music: [],
                Place: [],
                Plant: [],
                Show: [],
                Sport: [],
                Store: [],
                Vehicle: [],
                Other: []
            }

            for (var i = 0; i < p.likes.length; i++) {

                switch (p.likes[i].category) {
                    case 50:
                        l.Animal.push(p.likes[i]);
                        break;
                    case 100:
                        l.Beverage.push(p.likes[i]);
                        break;
                    case 200:
                        l.Book.push(p.likes[i]);
                        break;
                    case 300:
                        l.Food.push(p.likes[i]);
                        break;
                    case 400:
                        l.Game.push(p.likes[i]);
                        break;
                    case 550:
                        l.Jewelry.push(p.likes[i]);
                        break;
                    case 500:
                        l.Hobby.push(p.likes[i]);
                        break;
                    case 600:
                        l.Movie.push(p.likes[i]);
                        break;
                    case 700:
                        l.Music.push(p.likes[i]);
                        break;
                    case 725:
                        l.Place.push(p.likes[i]);
                        break;
                    case 750:
                        l.Plant.push(p.likes[i]);
                        break;
                    case 800:
                        l.Show.push(p.likes[i]);
                        break;
                    case 900:
                        l.Sport.push(p.likes[i]);
                        break;
                    case 1000:
                        l.Store.push(p.likes[i]);
                        break;
                    case 1100:
                        l.Vehicle.push(p.likes[i]);
                        break;
                    case 9999999:
                        l.Other.push(p.likes[i]);
                }
            }

            self._likesData = l;

            var dl = {
                Animal: [],
                Beverage: [],
                Book: [],
                Food: [],
                Jewelry: [],
                Game: [],
                Hobby: [],
                Movie: [],
                Music: [],
                Place: [],
                Plant: [],
                Show: [],
                Sport: [],
                Store: [],
                Vehicle: [],
                Other: []
            }

            for (var i = 0; i < p.dislikes.length; i++) {
                switch (p.dislikes[i].category) {
                    case 50:
                        dl.Animal.push(p.dislikes[i]);
                        break;
                    case 100:
                        dl.Beverage.push(p.dislikes[i]);
                        break;
                    case 200:
                        dl.Book.push(p.dislikes[i]);
                        break;
                    case 300:
                        dl.Food.push(p.dislikes[i]);
                        break;
                    case 400:
                        dl.Game.push(p.dislikes[i]);
                        break;
                    case 550:
                        dl.Jewelry.push(p.dislikes[i]);
                        break;
                    case 500:
                        dl.Hobby.push(p.dislikes[i]);
                        break;
                    case 600:
                        dl.Movie.push(p.dislikes[i]);
                        break;
                    case 700:
                        dl.Music.push(p.dislikes[i]);
                        break;
                    case 725:
                        dl.Place.push(p.dislikes[i]);
                        break;
                    case 750:
                        dl.Plant.push(p.dislikes[i]);
                        break;
                    case 800:
                        dl.Show.push(p.dislikes[i]);
                        break;
                    case 900:
                        dl.Sport.push(p.dislikes[i]);
                        break;
                    case 1000:
                        dl.Store.push(p.dislikes[i]);
                        break;
                    case 1100:
                        dl.Vehicle.push(p.dislikes[i]);
                        break;
                    case 9999999:
                        dl.Other.push(p.dislikes[i]);
                }
            }

            self._dislikesData = dl;

            this.checkLikesEmpty();
            this.checkDislikesEmpty();

            self.addTypeLike = this.likesProps[0].prop;
        }, error => alert(`Server error. Try again later`));
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }

    /**
     * Edit one Like or Dislike text
     * @param event
     * @param editTypeOfLike
     * @param isEditLikesParam
     * @param i
     */
    editLikes(event, editTypeOfLike, isEditLikesParam, i) {
        event.preventDefault();

        this.inEditMode = true;
        this.likeIndex = i;
        this.isAddLike = isEditLikesParam;
        this.isEditLikes = isEditLikesParam;
        this.editTypeOfLike = editTypeOfLike;
        this.addTypeLike = editTypeOfLike;
        this.origEditType = editTypeOfLike;

        setTimeout(function () {
            $('#addLikesModal').modal('show');
        }, 50)
    }

    /**
     * Delete like or dislike
     * @param $event
     * @param typeOfLike
     * @param isEditLikesParam
     * @param index
     */
    deleteLikes($event, typeOfLike, isEditLikesParam, index) {
        event.preventDefault();

        let msg = `Do you want to delete ${typeOfLike}?`;

        this._modalService.activate(msg).then(responseOK => {
            if (responseOK) {
                if (isEditLikesParam) {
                    this._likeSvc.archiveLike(this._likesData[typeOfLike][index].instanceId).subscribe(r => { console.log(r); }, error => alert(`Server error. Try again later`));
                    this._likesData[typeOfLike].splice(index, 1);
                    this.checkLikesEmpty();

                } else {
                    this._likeSvc.archiveLike(this._dislikesData[typeOfLike][index].instanceId).subscribe(r => { console.log(r); }, error => alert(`Server error. Try again later`));
                    this._dislikesData[typeOfLike].splice(index, 1);
                    this.checkDislikesEmpty();
                }
            }
        });
    }

    checkLikesEmpty() {
        for (let prop in this._likesData) {
            if (this._likesData[prop].length > 0) {
                this.areLikesEmpty = false;
                return false;
            }
        }

        this.areLikesEmpty = true;
    }

    checkDislikesEmpty() {
        for (let prop in this._dislikesData) {
            if (this._dislikesData[prop].length > 0) {
                this.areDislikesEmpty = false;
                return false;
            }
        }

        this.areDislikesEmpty = true;
    }

    addLike($event, isLike) {
        event.preventDefault();

        this.inEditMode = false;
        this.isAddLike = isLike;

        $('#addLikesModal').modal('show');
    }

    changeAddTypeLike(event, likeProp: string) {
        event.preventDefault();

        //if (this.inEditMode) {
        //    this.editTypeOfLike = likeProp;
        //} else {
        this.addTypeLike = likeProp;
        //};
    }

    closeLike(event, txtLike) {
        event.preventDefault();

        if (this.inEditMode) {
            //EDIT
            if (this.isEditLikes) {
                txtLike.value = this._likesData[this.editTypeOfLike][this.likeIndex].value;
            } else {
                txtLike.value = this._dislikesData[this.editTypeOfLike][this.likeIndex].value;
            }
        } else {
            //ADD NEW
            txtLike.value = '';
        }

        $('#addLikesModal').modal('hide');
    }

    /**
     * Add new like/dislike item
     * @param event
     * @param txtNewLike
     */
    saveLike(event, txtNewLike) {
        event.preventDefault();

        var self = this;
        var itemArr;

        if (this.inEditMode) {
            this.inEditMode = false;

            //Check if item transfered from likes to dislikes and viceversa
            // or category changed
            if (this.addTypeLike !== this.origEditType || this.isAddLike !== this.isEditLikes) {

                itemArr = this[this.isEditLikes ? "_likesData" : "_dislikesData"][this.origEditType].splice(this.likeIndex, 1);
                this[this.isAddLike ? "_likesData" : "_dislikesData"][this.addTypeLike].push(itemArr[0]);
                this.likeIndex = this[this.isAddLike ? "_likesData" : "_dislikesData"][this.addTypeLike].length - 1
            }

            //EDIT
            if (this.isAddLike) {

                this._likesData[this.origEditType][this.likeIndex].value = txtNewLike.value;

                this._likeSvc.updateLike(this._likesData[this.addTypeLike][this.likeIndex].instanceId,
                    {
                        Status: 1,
                        Category: this.LikeCategory[this.addTypeLike],
                        Value: txtNewLike.value
                    }
                ).subscribe(result => {
                    console.log(result);
                    //this.saving = false;

                    $('#addLikesModal').modal('hide');
                }, error => alert(`Server error. Try again later`));

            } else {

                this._dislikesData[this.addTypeLike][this.likeIndex].value = txtNewLike.value;

                this._likeSvc.updateLike(this._dislikesData[this.addTypeLike][this.likeIndex].instanceId,
                    {
                        Status: 0,
                        Category: this.LikeCategory[this.addTypeLike],
                        Value: txtNewLike.value
                    }
                ).subscribe(result => {
                    console.log(result);
                    //this.saving = false;

                    $('#addLikesModal').modal('hide');
                }, error => alert(`Server error. Try again later`));

            }
        } else {
            //ADD NEW
            if (this.isAddLike) {
                // Add Like
                this._likesData[this.addTypeLike].push({
                    status: 1,
                    category: this.LikeCategory[this.addTypeLike],
                    value: txtNewLike.value
                });

                this._likeSvc.addLike(this._selectedDude.instanceId,
                    {
                        Status: 1,
                        Category: this.LikeCategory[this.addTypeLike],
                        Value: txtNewLike.value
                    }
                ).subscribe(result => {
                    self.checkLikesEmpty();
                    //this.saving = false;
                    $('#addLikesModal').modal('hide');
                }, error => alert(`Server error. Try again later`));

            } else {
                //Add Dislike
                this._dislikesData[this.addTypeLike].push({
                    status: 0,
                    category: this.LikeCategory[this.addTypeLike],
                    value: txtNewLike.value
                })

                this._likeSvc.addLike(this._selectedDude.instanceId,
                    {
                        Status: 0,
                        Category: this.LikeCategory[this.addTypeLike],
                        Value: txtNewLike.value
                    }
                ).subscribe(result => {
                    self.checkDislikesEmpty();
                    //this.saving = false;
                    $('#addLikesModal').modal('hide');
                }, error => alert(`Server error. Try again later`));
            }
        }

        txtNewLike.value = '';
    }

    toggleLikeDislike(event) {
        event.preventDefault();
        this.isAddLike = !this.isAddLike;
    }
}

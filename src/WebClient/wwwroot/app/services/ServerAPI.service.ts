import { Injectable, Inject, Component } from 'angular2/core';
import { Person } from '../models/Person';
import { eyeColors } from '../models/eyeColors';
import { hairColors } from '../models/hairColors';
import { ClothingSizes } from '../models/ClothingSizes';
import { createEnum } from '../common/enum';
import { Http, Headers, RequestOptions } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

// Add all operators to Observable
import 'rxjs/Rx';

@Injectable()
export class ServerAPI {

    constructor(private http: Http) { }

    static apiUrl = "http://localhost:47503/api/";
    static localUrl = "http://localhost:3000/";

    peopleList: Person[] = [];
    static person: Person;

    /**
     * @description Get person by Instance Id
     * @param {string} instanceId
     * @returns Person
     */
    getPersonByInstanceId(instanceId: string): Observable<Person> {

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // If Person is already in memory
        // just return it
        if (ServerAPI.person) {  
            return Observable.create(function (observer) {
                observer.next(ServerAPI.person);
                observer.complete();
            });
        } else {
            var httploc = this.http;
            return Observable.create(function (observer) {
                httploc.post(ServerAPI.apiUrl + 'EntityApi/Details',
                    JSON.stringify({
                        "Key": {
                            "InstanceId": instanceId
                        }
                    }), { headers: headers })
                    .map(res => Person.createRPerson(res.json())).subscribe((person) => {
                        ServerAPI.person = person;
                        observer.next(ServerAPI.person);
                        observer.complete();
                    });
            });                     
        }
    }
   
    /**
     * @description get a json list of
     * @returns Obesrvable list of Persons
     */
    getAllPeople() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(ServerAPI.apiUrl + '/EntityApi/List', '', { headers: headers })
            .map(res => res.json())
            .subscribe((plist) => {

                console.log("People list: ", plist);
                
                // If PeopleList is already in memory
                // just return it
                if (this.peopleList.length > 0) {
                    return Observable.from(this.peopleList).toArray();
                }

                if (localStorage.getItem("people")) {
                    // If data is cached in localStorage, use it
                            
                    for (let personJson of JSON.parse(localStorage.getItem("people"))) {
                        this.peopleList.push(Person.createRPerson(personJson));
                    }

                    return Observable.from(this.peopleList).toArray();
                    //return new Observable<Array<Person>>().share()

                } else {
                    // LocalStorage is empty

                    for (let personJson of plist) {
                        this.peopleList.push(Person.createRPerson(personJson));
                    }

                    return Observable.from(this.peopleList).toArray();                    
                };

                return Observable.from(this.peopleList).toArray();
            });
    }
     
    /**
     * Add Person
     * @param {string} name
     * @returns
     */
    addPerson(name: string) {
        let body = JSON.stringify({
            Values: { Name: name }
        });
        
        var options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

        return this.http.post(ServerAPI.apiUrl + "EntityApi/Add", body, options)
            .map(res => res.json())
            .catch(this.logAndPassOn);
    }

    /**
     * Update Person
     * @param {string} instanceId
     * @param {string} name
     * @returns
     */
    updatePerson(instanceId: string, name: string) {
        let body = JSON.stringify({
            Key: { InstanceId: instanceId },
            Values: { Name: name }
        });

        return this.http.post(ServerAPI.apiUrl + "EntityApi/Update", body, new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) }))
            .map(res => res.json())
            .catch(this.logAndPassOn);
    }
     

    getLA() { 
        return this.http.get(ServerAPI.localUrl + 'app/_db/lalang.json').map(res => res.json());        
    }

    private logAndPassOn(error: Error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error);
    }
}

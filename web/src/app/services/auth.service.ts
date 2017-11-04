/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages the user
 * Right now, keeps track if user is logged in or not
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouterModule, Routes, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

// Importing database service so we can check to see if the user login information exists
import { DBService } from './db.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    public isLoggedIn: boolean = false;
    public redirectUrl: string;
    jwtHelper: JwtHelper = new JwtHelper();
    enteredPassword: any;
    public constructor(private db: DBService, private router: Router, private user: UserService){
        // If the user reloads the page, keep them logged in
        // Check session storage for presence of JWT key and verify it
        // http://angularjs.blogspot.com/2016/11/easy-angular-authentication-with-json.html
        this.checkLogin();
    }
    checkLogin(): boolean {
        // Check to see if there is jwt in local storage
        // If not, return false
        if(sessionStorage.getItem('jwt') == null){
            return false;
        }
        else{
            var token = sessionStorage.getItem('jwt');
            var jwt = this.jwtHelper.decodeToken(token);
            this.user.setInfo(sessionStorage.getItem('jwt'));
            console.log(this.jwtHelper.decodeToken(token));
            console.log("JWT token expired: " + this.jwtHelper.isTokenExpired(token));
            // Get user's profile picture
            this.db.getProfilePhoto(this.user.user_id).then(res => {
                console.log(res.json());
                if(res._body == "[]"){ // The user had no profile picture
                    console.log("User has no profile picture");
                }
                else{
                    this.user.profilePhoto = this.db.url + "/" + res.json()[0].profile_photo;
                    console.log(res.json());
                    console.log(this.user.profilePhoto);
                }
            });
            return !this.jwtHelper.isTokenExpired(token);
        }
    }
    login(email, password): any {
        console.log(this.isLoggedIn);
        this.enteredPassword = password;
        var userFound = true;
        // Take user information entered in fields and pass to DB service
        this.db.login(email, password).then(res => {
            console.log(res);
            if(res._body == "User not found"){
                console.log("ha");
                userFound = false;
                return userFound;
            }
            else{
                this.isLoggedIn = true;
                // Take the JWT stored in the response and store it local storage
                sessionStorage.setItem('jwt', res._body);
                console.log(sessionStorage);
                // Get info from JWT and store it in the user service
                this.user.setInfo(sessionStorage.getItem('jwt'));
                // Set info in user service
                console.log(res.rows);
                // Get the user's profile photo
                this.db.getProfilePhoto(this.user.user_id).then(res => {
                    console.log(res.json());
                    if(res._body == "[]"){ // The user had no profile picture
                    console.log("User has no profile picture");
                    }
                    else{
                    this.user.profilePhoto = this.db.url + "/" + res.json()[0].profile_photo;
                    console.log(res.json());
                    console.log(this.user.profilePhoto);
                    }
                    // Navigate the user to home
                    this.router.navigate(['home']);
                    userFound = true;
                    return userFound;
                });
            }
        }).then(response => response);
    }
    /**
     * Redirects the user to the homepage when logging out
     */
    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(['home']);
    }
}
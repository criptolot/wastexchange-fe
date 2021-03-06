import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Bid, SellerItem, MATERIALS } from './app.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { BuyerService } from './shared/services/buyer.service';
import { SellerService } from './shared/services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public isUserLoggedIn: boolean = false;
  public userSessionData: Object;
  public loggedInUserInfo: any;
  public allSellers: any[] = [];
  public allBuyers: any[] = [];
  public allUsers: any[] = [];
  public allItems: any[] = [];
  public isLoading: boolean = false;
  public materials = MATERIALS;
  public hidePageActions: boolean = false;

  constructor(
    private http: HttpClient,
    private rtr: Router,
    public snackBar: MatSnackBar,
    private buyerServ: BuyerService,
    private sellerServ: SellerService
  ) {}

  public getAllBids(): Observable<Bid[]> {
    return this.buyerServ.getAllBids();
  }

  public getBidsForBuyer(buyerId): Observable<Bid[]> {
    return this.buyerServ.getBidsForBuyer(buyerId);
  }

  public getSellerItems(sellerId): Observable<SellerItem> {
    return this.sellerServ.getSellerItems(sellerId);
  }

  public updateSellerItem(sellerItem: SellerItem): Observable<any> {
    return this.sellerServ.updateSellerItem(sellerItem);
  }

  public createBid(bid: Bid): Observable<any> {
    return this.buyerServ.createBid(bid);
  }

  public updateBid(bid: Bid): Observable<any> {
    return this.buyerServ.updateBid(bid);
  }

  public getBidById(bidId: number): Observable<any> {
    return this.buyerServ.getBid(bidId);
  }

  public getAllItems() {
    return this.http.get<any[]>(environment.hostName + '/items');
  }

  /**
   * @description approve a particular user by id
   * @param id the user id to approve
   */
  public approveUser(id: number): Observable<any> {
    return this.http.put<any>(environment.hostName + '/users/' + id + '/approve', {});
  }

  public getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(environment.hostName + '/users');
  }

  public getAllUsersAndFilter(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllUsers().subscribe(response => {
        this.allUsers = response;
        this.allBuyers = response.filter(user => user.persona == 'buyer');
        this.allSellers = response.filter(user => user.persona == 'seller');
        resolve(true);
      });
    });
  }

  /**
   * @description delelte a particular user by id
   * @param id the user id to perform the delete operation on
   */
  public deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(environment.hostName + `/users/${id}`);
  }

  /**
   * @description remove a user from the client
   * @param id the id to remove
   */
  public removeUserById(id: number) {
    this.allBuyers = this.allBuyers.filter(buyer => buyer.id !== id);
    this.allSellers = this.allSellers.filter(seller => seller.id !== id);
    this.allUsers = this.allUsers.filter(user => user.id !== id);
  }

  /**
   * @description approve a user
   * @param user the user to approve
   */
  public approveUserData(user: any) {
    let userType = user.persona == 'buyer' ? 'Buyer' : 'Seller';
    this.approveUser(user.id).subscribe(
      response => {
        user.approved = true;
        this.openSnackBar(`${userType} approved successfully`, 'DISMISS');
      },
      () => {
        this.openSnackBar(`Oops! Could not approve ${user.persona}`, 'DISMISS');
      }
    );
  }

  /**
   * @description delete the user
   * @param user the user to delete
   */
  public deleteUserData(user: any) {
    let userType = user.persona == 'buyer' ? 'Buyer' : 'Seller';
    this.deleteUser(user.id).subscribe(
      () => {
        this.removeUserById(user.id);
        this.openSnackBar(`${userType} removed successfully`, 'DISMISS');
      },
      () => {
        this.openSnackBar(`Oops! Could not delete ${user.persona}`, 'DISMISS');
      }
    );
  }

  public sendOtp(payload: any): Observable<any> {
    return this.http.post<any>(environment.hostName + '/users/sendOtp', payload);
  }

  public registerUser(userDetails: any): Observable<any> {
    return this.http.post<any>(environment.hostName + '/users/register', userDetails);
  }

  public loginUser(loginPayload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(environment.hostName + '/users/login', loginPayload).subscribe(
        loginResponse => {
          this.setSessionData(loginResponse);
          this.getMe().subscribe(response => {
            this.loggedInUserInfo = response;
            this.getAllUsersAndFilter().then(() => {
              resolve(loginResponse);
            });
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getMe(): Observable<any> {
    return this.http.get<any>(environment.hostName + '/users/me');
  }

  public authorizeUser(): boolean {
    this.userSessionData = this.getUserSessionDataFromSession();
    this.isUserLoggedIn = !!(Object.keys(this.userSessionData).length && this.userSessionData['auth']);
    return this.isUserLoggedIn;
  }

  public getUserSessionDataFromSession() {
    let _userSessionData = new Object();
    for (let _counter = 0; _counter < sessionStorage.length; _counter++) {
      _userSessionData[sessionStorage.key(_counter)] = sessionStorage.getItem(sessionStorage.key(_counter));
    }
    return _userSessionData;
  }

  public clearSessionData() {
    sessionStorage.clear();
    this.userSessionData = new Object();
    this.isUserLoggedIn = false;
    this.loggedInUserInfo = null;
  }

  public forceLogoutUser() {
    this.clearSessionData();
    this.rtr.navigate(['']);
  }

  public setSessionData(userSessionData: Object) {
    Object.keys(userSessionData).forEach(key => {
      sessionStorage.setItem(key, userSessionData[key]);
      sessionStorage.setItem('sessionCreatedTime', Date.now().toString());
    });
    this.userSessionData = userSessionData;
    this.isUserLoggedIn = true;
  }

  public getSessionValue(key: string) {
    return sessionStorage.getItem(key) || '';
  }

  public setLoading(value) {
    setTimeout(() => {
      this.isLoading = value;
    }, 0);
  }

  /**
   * @description open material snackbar
   * @param message the message to display
   * @param action the action label
   * @param duration the duration of the snackbar, default: 5000 ms
   */
  public openSnackBar(message: string, action: string, duration: number = 5000) {
    return this.snackBar.open(message, action, { duration: duration, panelClass: 'text--white' });
  }

  //utils

  public setDefaultMaterialData(sellerItem) {
    Object.keys(this.materials).forEach(material => {
      !sellerItem.details[material] && (sellerItem.details[material] = { quantity: 0, cost: 0, bid: 0 });
    });
    return sellerItem;
  }
}

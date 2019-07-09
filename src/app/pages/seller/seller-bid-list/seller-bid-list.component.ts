import { Component, OnInit } from '@angular/core';
import { Buyer, BUYER_DATA, Seller, SELLER_DATA } from "./../../../app.model";


@Component({
  selector: 'wm-seller-bid-list',
  templateUrl: './seller-bid-list.component.html',
  styleUrls: ['./seller-bid-list.component.scss']
})
export class SellerBidListComponent implements OnInit {
  public buyer: Buyer = BUYER_DATA[0];
  public seller: Seller = SELLER_DATA[0];
  constructor() { }

  ngOnInit() {
  }

}
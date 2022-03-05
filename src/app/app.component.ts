import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angularCrud-usingJson';
  displayedColumns: string[] = ['productname', 'productcategory', 'date', 'freshness','price','comment','action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog , private api:ApiService) {

  }
  ngOnInit(): void {
    this.getAllProduct();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:"30%"
    }).afterClosed().subscribe(val=>{
      if(val == 'submit'){
        this.getAllProduct();
     }
    })
  }

editProduct(row:any){
  this.dialog.open(DialogComponent,{
    width:'30%',
    data:row
  }).afterClosed().subscribe(val=>{
    if(val == 'update'){
      this.getAllProduct();
   }
  });
    
    
}

//getting the product details from the product form
 getAllProduct(){
   this.api.getProduct()
   .subscribe({
     next:(res)=>
     {
       this.dataSource = new MatTableDataSource(res); //to store the response data
       this.dataSource.paginator = this.paginator; 
       this.dataSource.sort = this.sort;
     },
     error:(err)=>{
     alert("error while fetching the product details")
     }
   })
 }
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
 //deleting product details in the UI
 deleteproduct(id:number){
   this.api.deleteproduct(id)
   .subscribe({
     next:(res)=>
    {
      alert("Product details deleted successfully");
      this.getAllProduct();
    },
    error:()=>{
    alert("error while deleting the product");
    }
   })
 }
}

    



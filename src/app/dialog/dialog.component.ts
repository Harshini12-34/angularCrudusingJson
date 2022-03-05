import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service'; 
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productForm!: FormGroup; //creating the name of the form to manipulate in ts file

  constructor(private formBuilder:FormBuilder ,
     private api : ApiService ,  // injecting the api to get the data form server and display as table in UI
     @Inject(MAT_DIALOG_DATA) public editData:any, //injecting the dialog data so that details appear in form  and next step is to patch the data which is below
     private dialogRef:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
   this.productForm = this.formBuilder.group({
     productname : ['',Validators.required], // validating the form if it has empty field..
     productcategory : ['',Validators.required],
     date:['',Validators.required],
     freshness:['',Validators.required],
     price:['',Validators.required],
     comment:['',Validators.required],

   });
   if(this.editData){
     this.actionbtn = 'update'; //update button appears if we edit the data
     this.productForm.controls['productname'].setValue(this.editData.productname); //binding and patching the values to the form when we click edit details will be available
     this.productForm.controls['productcategory'].setValue(this.editData.productcategory);
     this.productForm.controls['date'].setValue(this.editData.date);
     this.productForm.controls['freshness'].setValue(this.editData.freshness);
     this.productForm.controls['price'].setValue(this.editData.price);
     this.productForm.controls['comment'].setValue(this.editData.comment);
   }
  }
  list:any = [  "Electronics", "fruits", "vegetables"];
  actionbtn:string = 'save';
  
  //method for submitting the form
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value) //posting the product details submiited through the form
        .subscribe({
            next:(res) =>{
              alert("Product added successfully");
              this.productForm.reset(); //resets the form after the product is added
              this.dialogRef.close('submit') //closes the form after it is submitted
            },
            error:()=>{
              alert("Error in adding the product");
            }
  
          }
        )
  
      }
    }
    else{
      this.updateProduct();
    }
  }
  updateProduct(){
    this.api.putProduct(this.editData.id, this.productForm.value )
    .subscribe({
      next:(res)=>{
        alert("Product details updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
       alert("error while updating the record");    
      }
    })
  }

}

import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HouseService} from "../../services/house/house.service";
import {House} from "../../models/house.model";

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ]
})
export class HouseDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly houseService = inject(HouseService);
  private router = inject(Router);

  houseForm!: FormGroup;
  houseNumberTaken = ['A-L-001', 'B-2-002'];
  public id = this.activatedRoute.snapshot.params['id'];
  house: House = new House();
  // isEditMode = false;

  constructor() {}

  ngOnInit(): void {
    this.initForm();
    if (this.id && history.state.house) {
      this.house = history.state.house;

      this.houseForm.patchValue({
        houseNumber: this.house.houseNumber,
        blockNumber: this.house.blockNumber,
        landNumber: this.house.landNumber,
        houseType: this.house.houseType,
        houseModel: this.house.model,
        price: this.house.price,
      });
    }
  }

  initForm() {
    this.houseForm = this.fb.group({
      houseNumber: ['', [Validators.required]],
      blockNumber: ['', Validators.required],
      landNumber: ['', Validators.required],
      houseType: ['Apartment', Validators.required],
      houseModel: ['apartment-001', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d[\d\s]*$/)]],
      status: ['Available', Validators.required],
    });
  }

  houseNumberValidator(control: any) {
    const value = control.value?.trim();
    if (this.houseNumberTaken.includes(value)) {
      return { duplicate: true };
    }
    return null;
  }

  get f() {
    return this.houseForm.controls;
  }

  onCreateUpdate(): void {
    if (this.house.id) {
      this.houseService.updateHouse(this.house).subscribe({
        next: (updatedHouse) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
        }
      });
    } else {
      const { id, ...houseData } = this.house;
      this.houseService.createHouse(houseData).subscribe({
        next: (newHouse) => {
          this.router.navigate(['/']); // Navigate về homepage
        },
        error: (err) => {
        }
      });
    }
  }
}

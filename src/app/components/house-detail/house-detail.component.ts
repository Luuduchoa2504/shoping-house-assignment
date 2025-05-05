import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HouseService } from '../../services/house/house.service';
import { House } from '../../models/house.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html',
  styleUrls: ['./house-detail.component.scss'],
  standalone: true,
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
  private toastr = inject(ToastrService);

  houseForm!: FormGroup;
  houseNumberTaken = ['A-L-001', 'B-2-002'];
  public id = this.activatedRoute.snapshot.params['id'];
  house: House = new House();

  ngOnInit(): void {
    this.initForm();
    if (this.id) {
      this.loadHouseDetail();
    }
  }

  initForm() {
    this.houseForm = this.fb.group({
      houseNumber: ['', [Validators.required, this.houseNumberValidator.bind(this)]],
      blockNumber: ['', Validators.required],
      landNumber: ['', Validators.required],
      houseType: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]],
      status: ['', Validators.required],
    });
  }

  loadHouseDetail() {
    this.houseService.getHouseDetail(this.id).subscribe({
      next: (house) => {
        this.house = house;
        this.houseForm.patchValue({
          houseNumber: house.houseNumber || '',
          blockNumber: house.blockNumber || '',
          landNumber: house.landNumber || '',
          houseType: this.capitalizeFirstLetter(house.houseType) || 'Apartment',
          model: house.model || '',
          price: house.price || '',
          status: this.capitalizeFirstLetter(house.status) || 'Available',
        });
      },
      error: (err) => {
        this.toastr.error('Failed to load house details.', 'Error');
        console.error('Load house error:', err);
      },
    });
  }

  capitalizeFirstLetter(value: string | undefined): string | undefined {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  houseNumberValidator(control: AbstractControl) {
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
    if (this.houseForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.', 'Invalid Form');
      return;
    }

    const formValue = this.houseForm.value;
    const houseData: House = {
      ...this.house,
      houseNumber: formValue.houseNumber?.trim() || '',
      blockNumber: formValue.blockNumber?.trim() || '',
      landNumber: formValue.landNumber?.trim() || '',
      houseType: formValue.houseType?.toLowerCase() || '',
      model: formValue.model || '',
      price: Number(formValue.price) || 0,
      status: formValue.status?.toLowerCase() || '',
    };

    if (this.id) {
      houseData.id = this.id;
      this.houseService.updateHouse(houseData).subscribe({
        next: () => {
          this.toastr.success('House updated successfully.', 'Success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          const errorMessage = err.error?.errors?.[0]?.detail || 'Failed to update house.';
          this.toastr.error(errorMessage, 'Error');
          console.error('Failed to update house:', err);
        },
      });
    } else {
      this.houseService.createHouse(houseData).subscribe({
        next: (newHouse) => {
          this.toastr.success('House created successfully.', 'Success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          const errorMessage = err.error?.errors?.[0]?.detail || 'Failed to create house.';
          this.toastr.error(errorMessage, 'Error');
          console.error('Failed to create house:', err);
        },
      });
    }
  }
}

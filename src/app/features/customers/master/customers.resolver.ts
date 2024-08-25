import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {Observable} from 'rxjs';
import {CustomerService} from "@app/features/customers/service/customer.service";
import {Customer} from "@app/features/customers/shared/models/Customer";

export const customersResolver: ResolveFn<Observable<Array<Customer>>> = (route) => {
  const customerService = inject(CustomerService);
  const someParam = route.params['some-param'];

  return customerService.getCustomers();
};

import {inject} from '@angular/core';
import {ResolveFn, ActivatedRouteSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CustomerService} from '@app/features/customers/service/customer.service';
import AppUtils from '@app/shared/utils/AppUtils';
import StringUtils from '@app/shared/utils/StringUtils';
import {Customer} from "@app/features/customers/shared/models/Customer";

export const customerViewResolver: ResolveFn<Observable<Customer | null>> = (route: ActivatedRouteSnapshot) => {
  const customerService = inject(CustomerService);
  const appUtils = inject(AppUtils);

  const customerId = route.params['id'];
  if (StringUtils.isNotEmpty(customerId)) {
    return customerService.getCustomer(customerId).pipe(
      catchError(appUtils.handleHttpError)
    );
  }
  return of(null);
};

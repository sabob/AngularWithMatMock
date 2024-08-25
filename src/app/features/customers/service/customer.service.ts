import {Injectable} from "@angular/core";
import {environment} from '@app/./../environments/environment';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from "@angular/router";

import {Observable} from "rxjs";
import {catchError, finalize, tap} from "rxjs/operators";
import AppUtils from "@app/shared/utils/AppUtils";
import {FeedbackService} from "@app/shared/service/feedback/feedback.service";
import {Customer} from "@app/features/customers/shared/models/Customer";

@Injectable({providedIn: 'root'})
export class CustomerService {

  constructor(private http: HttpClient, private router: Router, private feedbackService: FeedbackService, private appUtils: AppUtils) {
  }

   update(customer: Customer): Observable<Customer> {

    let httpOptions: Object = {

      headers: new HttpHeaders({}),
      responseType: 'json'
    };

    let observable: Observable<any> = this.http.put<Customer>(`${environment.customersUrl}/${customer.uuid}`, httpOptions)
      .pipe(
        catchError(this.appUtils.handleHttpError),
        finalize(() => {
          console.log("updated customer uuid:", customer.uuid)
        })
      );

    return observable;
  }

  create(data: Customer): Observable<Customer> {

    let httpOptions: Object = {

      headers: new HttpHeaders({}),
      responseType: 'json'
    };

    let observable: Observable<Customer> = this.http.post<any>(environment.customersUrl, data, httpOptions)
      .pipe(
        tap( customer => {
          console.log("created customer uuid:", customer.uuid)
        }),
        catchError(this.appUtils.handleHttpError),
        finalize(() => {
        })
      );

    return observable;
  }

  getCustomer(id: string): Observable<Customer> {
    let httpParams = new HttpParams();
    let httpOptions: Object = {

      headers: new HttpHeaders({}),
      responseType: 'json',
      params: httpParams
    };

    let observable: Observable<Customer> = this.http.get<any>(`${environment.customersUrl}/${id}`, httpOptions)
      .pipe(
        catchError(this.appUtils.handleHttpError),
        finalize(() => {
          console.log("request completed")
        })
      );
    return observable;
  }

  getCustomers(query: string = "", page: number = 1, pageSize: number = 10): Observable<Array<Customer>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("query", query);
    httpParams = httpParams.set("page", "" + page);
    httpParams = httpParams.set("pageSize", "" + pageSize);

    let httpOptions: Object = {

      headers: new HttpHeaders({}),
      responseType: 'json',
      params: httpParams
    };

    let observable: Observable<Array<Customer>> = this.http.get<any>(environment.customersUrl, httpOptions)
      .pipe(
        catchError(this.appUtils.handleHttpError),
        finalize(() => {
        })
      );
    return observable;
  }
}

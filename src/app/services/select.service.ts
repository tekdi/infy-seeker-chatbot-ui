import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from './transaction-service.service';

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  private endpoint = 'http://localhost:3000/select';

  constructor(private http: HttpClient, private transactionService: TransactionService) { }

  selectCourse(courseId: string, providerId: string) {
    const body = {
      context: {
        "domain": "onest:learning-experiences",
        "action": "select",
        "version": "1.1.0",
        "bap_id": "kahani-bap.tekdinext.com",
        "bap_uri": "https://kahani-bap.tekdinext.com/",
        "bpp_id": "kahani-bpp.tekdinext.com",
        "bpp_uri": "https://kahani-bpp.tekdinext.com/",
        transaction_id: this.transactionService.getTransactionId(),
        message_id: this.transactionService.generateMessageId(),
        timestamp: new Date().toISOString()
      },
      message: {
        order: {
          provider: { id: providerId },
          items: [{ id: courseId }]
        }
      }
    };
    return this.http.post<any>(this.endpoint, body);
  }
}


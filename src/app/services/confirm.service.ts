import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from './transaction-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private endpoint = 'https://kahani-api.tekdinext.com/confirm';

  constructor(private http: HttpClient, private transactionService: TransactionService) { }

  confirmOrder(courseId: string, providerId: string, userDetails: any) {
    const payload = {
      context: {
        "domain": "onest:learning-experiences",
        "action": "confirm",
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
          items: [{
            id: courseId,
            quantity: {
              maximum: {
                count: 1
              }
            },
            parent_item_id: courseId,
            descriptor: {
              name: "How to Look for Better Opportunities as a Blue Collar Worker",
              short_desc: "This comprehensive course offers a deep dive into the world of blue-collar jobs, focusing specifically on opportunities in renewable energy. From understanding the basics of blue-collar professions to exploring specialized fields like EV charging and solar energy, participants will gain valuable insights into building a rewarding career in the sustainable energy sector.",
              long_desc: "This comprehensive course offers a deep dive into the world of blue-collar jobs, focusing specifically on opportunities in renewable energy. From understanding the basics of blue-collar professions to exploring specialized fields like EV charging and solar energy, participants will gain valuable insights into building a rewarding career in the sustainable energy sector.",
              images: [],
              media: []
            },
            creator: {
              descriptor: {
                name: "Vowel"
              }
            },
            price: {
              currency: "INR",
              value: "0"
            },
            category_ids: ["Course"],
            rating: "NaN",
            rateable: true,
            tags: [
              {
                display: true,
                descriptor: {
                  name: "courseInfo",
                  code: "courseInfo",
                  list: [
                    {
                      display: true,
                      descriptor: {
                        code: "sourceOrganisation",
                        name: "Source Organisation"
                      },
                      value: "sourceOrganisation"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "urlType",
                        name: "Url Type"
                      },
                      value: "Page"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "competency",
                        name: "Competency"
                      },
                      value: "competency"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "contentType",
                        name: "Content Type"
                      },
                      value: "Video"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "domain",
                        name: "Domain"
                      },
                      value: "Career advancement"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "curriculargoal",
                        name: "Curricular Goal"
                      },
                      value: "curriculargoal"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "language",
                        name: "Language"
                      },
                      value: "Hindi"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "themes",
                        name: "Themes"
                      },
                      value: "themes"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "minAge",
                        name: "minAge"
                      },
                      value: "10"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "maxAge",
                        name: "maxAge"
                      },
                      value: "null"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "author",
                        name: "author"
                      },
                      value: "Vowel"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "curricularGoals",
                        name: "curricularGoals"
                      },
                      value: "curricularGoals"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "learningOutcomes",
                        name: "learningOutcomes"
                      },
                      value: "learningOutcomes"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "persona",
                        name: "persona"
                      },
                      value: "Learner"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "license",
                        name: "license"
                      },
                      value: "Youtube"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "createdon",
                        name: "createdon"
                      },
                      value: "2024-05-10T06:17:54.10338+00:00"
                    },
                    {
                      display: true,
                      descriptor: {
                        code: "lastupdatedon",
                        name: "lastupdatedon"
                      },
                      value: "2024-05-10T06:17:54.10338+00:00"
                    }
                  ]
                }
              }
            ],
            xinput: {
              head: {
                descriptor: {
                  name: "Application Form"
                },
                index: {
                  min: 0,
                  cur: 1,
                  max: 1
                }
              },
              form: {
                url: `https://onest-bap.tekdinext.com/application/${courseId}/${this.transactionService.generateMessageId()}`,
                mime_type: "text/html",
                resubmit: false,
                submission_id: this.transactionService.generateMessageId()
              },
              required: true
            }
          }],
          fulfillments: [
            {
              customer: {
                person: {
                  name: userDetails.name,
                  age: userDetails.age,
                  tags: [
                    {
                      code: "distributor-details",
                      list: [
                        {
                          descriptor: {
                            code: "distributor-name",
                            name: "Distributor Name"
                          },
                          value: ""
                        },
                        {
                          descriptor: {
                            code: "agent-id",
                            name: "Agent Id"
                          },
                          value: ""
                        }
                      ]
                    }
                  ]
                },
                contact: {
                  phone: userDetails.phone,
                  email: userDetails.email
                }
              }
            }
          ],
          type: "DEFAULT"
        }
      }
    };

    return this.http.post<any>(this.endpoint, payload);
  }
}

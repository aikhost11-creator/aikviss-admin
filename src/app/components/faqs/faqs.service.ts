import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../shared/environment/environment';

@Injectable({ providedIn: 'root' })
export class FaqsService {

    get base() { return environment.APIUrl + 'faq'; }

    constructor(private http: HttpClient) {}

    // Topics
    getTopics()                      { return this.http.get<any>(`${this.base}/topics`); }
    createTopic(d: any)              { return this.http.post<any>(`${this.base}/topics`, d); }
    updateTopic(id: number, d: any)  { return this.http.put<any>(`${this.base}/topics/${id}`, d); }
    deleteTopic(id: number)          { return this.http.delete<any>(`${this.base}/topics/${id}`); }

    // FAQs
    getFaqs(topicId?: number | null) {
        const q = topicId ? `?topicId=${topicId}` : '';
        return this.http.get<any>(`${this.base}/${q}`);
    }
    createFaq(d: any)                { return this.http.post<any>(`${this.base}/`, d); }
    updateFaq(id: number, d: any)    { return this.http.put<any>(`${this.base}/${id}`, d); }
    deleteFaq(id: number)            { return this.http.delete<any>(`${this.base}/${id}`); }

    // Config
    getConfig()                      { return this.http.get<any>(`${this.base}/config`); }
    upsertConfig(d: any)             { return this.http.put<any>(`${this.base}/config/upsert`, d); }
}

import { Injectable } from '@angular/core'
import { Relation } from './relations.types'

import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CardElementSchema, PartialLoadItem } from '../shared'

@Injectable()
export class RelationsService {
  relations: Relation[] = []
  progress = { value: 0 }
  relationElements: CardElementSchema[] = [
    { name: 'name', label: 'Name', validation: null },
    { name: 'surname', label: 'Surname', validation: null },
    {
      name: 'gender',
      label: 'Gender',
      validation: ['male', 'female', 'other']
    },
    { name: 'age', label: 'Age', validation: null },
    { name: 'phone', label: 'Phone', validation: null },
    { name: 'email', label: 'Email', validation: null },
    { name: 'address', label: 'Address', validation: null }
  ]

  constructor(private http: HttpClient) {}

  private loadRelationObserver$() {
    return new Observable<PartialLoadItem<Relation>>((subscriber) => {
      this.http.get('assets/sample.json').subscribe((data: any) => {
        // Mocking the loading of the relations
        let index = 0
        const itemLoadSimulatedDelay = 200 // ms
        const interval = setInterval(() => {
          if (index === data.length) {
            clearInterval(interval)
            return subscriber.complete()
          }

          subscriber.next({
            item: data[index] as Relation,
            index,
            total: data.length
          })
          index++
        }, itemLoadSimulatedDelay)
      })
    })
  }

  initializeRelations() {
    this.relations = []
    this.loadRelationObserver$().subscribe((data) => {
      this.relations.push(data.item)
      this.progress.value = ((data.index + 1) / data.total) * 100
    })
  }

  getRelation(id: string): Relation | undefined {
    return this.relations.find((relation) => relation.id === id)
  }
}
import { Injectable } from '@angular/core';
import { HELP_INDEX_DATA } from './index-data';
import { create, search, insertMultiple, Results, TypedDocument, Orama, SearchParams } from '@orama/orama';

export type HelpTopic = TypedDocument<Orama<typeof HELP_SCHEMA>>;

const HELP_SCHEMA = {
  id: 'string',
  title: 'string',
  text: 'string',
} as const;

@Injectable({ providedIn: 'root' })
export class HelpIndexService {

  private readonly helpDb: Orama<typeof HELP_SCHEMA>;

  constructor() {
    this.helpDb = create({ schema: HELP_SCHEMA });
    insertMultiple(this.helpDb, HELP_INDEX_DATA, 300);
  }

  public search(term: string): Results<HelpTopic> {
    let properties: 'title'[] | '*' = '*';
    if (term.startsWith('title:')) {
      term = term.slice(6);
      properties = ['title'];
    }
    const searchParams: SearchParams<Orama<typeof HELP_SCHEMA>> = {
      term,
      properties,
      boost: { title: 3 },
      limit: 100,
      tolerance: 1,
    }
    return search(this.helpDb, searchParams) as Results<HelpTopic>; // Ignore Promise<> alternate.
  }
}

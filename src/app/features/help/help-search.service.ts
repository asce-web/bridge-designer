import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HelpSearchService {
  /** Searches from the given root node*/
  public search(regEx: string, node: Node): string[] {
    const matcher = new RegExp(regEx, 'igms');
    if (!matcher) {
      return [];
    }
    const result: { [key: string]: number } = {};

    const bumpResult = (key: string, increment: number): void => {
      const value = result[key];
      if (value === undefined) {
        result[key] = increment;
        return;
      }
      result[key] = value + increment;
    };

    const getId = (node: Node): string | undefined => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return undefined;
      }
      const id = (node as Element).id;
      return id.startsWith('hlp_') || id.startsWith('gls_') ? id : undefined;
    };

    const walk = (node: Node, topic?: string): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!topic) {
          return;
        }
        const content = (node as Text).textContent;
        if (!content) {
          return;
        }
        const matches = content.match(matcher);
        if (!matches) {
          return;
        }
        bumpResult(topic, matches.length);
        return;
      }
      const nodeTopic = getId(node);
      node.childNodes.forEach(child => walk(child, nodeTopic));
    };

    walk(node);

    const entries = Object.entries(result);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.map(entry => entry[0]);
  }
}

export interface Editable {
  index: number;
  swapContents(other: Editable): void;
}

export abstract class EditCommand {
  constructor(
    public readonly description: string,
    protected readonly context: any,
  ) { }

  public abstract do(): void;
  public abstract undo(): void;
}

export class EditableUtility {
  /**
     * Merges a list of new Editables into a mutable target list. The list must have indexes in 
     * ascending order (not checked). These are used to place the new items. The target is re-indexed.
     */
  public static merge<T extends Editable>(tgt: T[], src: T[]): void {
    var iTgtSrc: number = tgt.length - 1;
    tgt.length += src.length;
    var iTgtDst: number = tgt.length - 1;
    for (var iSrc = src.length - 1; iSrc >= 0; --iSrc) {
      while (iTgtDst > src[iSrc].index) {
        tgt[iTgtSrc].index = iTgtDst;
        tgt[iTgtDst--] = tgt[iTgtSrc--];
      }
      tgt[iTgtDst--] = src[iSrc];
    }
  }

  /** Removes a given subsequence from a mutable target list of Editables. The target is re-indexed. */
  public static remove<T extends Editable>(tgt: T[], subseq: T[]): void {
    var iTgtSrc: number = 0;
    var iTgtDst: number = 0;
    for (var iSubseq = 0; iSubseq < subseq.length; iSubseq++) {
      while (iTgtSrc < subseq[iSubseq].index) {
        tgt[iTgtSrc].index = iTgtDst;
        tgt[iTgtDst++] = tgt[iTgtSrc++];
      }
      subseq[iSubseq] = tgt[iTgtSrc++];
    }
    while (iTgtSrc < tgt.length) {
      tgt[iTgtSrc].index = iTgtDst;
      tgt[iTgtDst++] = tgt[iTgtSrc++];
    }
    tgt.length -= subseq.length;
  }

  /** Swap the contents of the given item with the contents of the same-index item in the given vector. */
  public static exchange<T extends Editable>(tgt: T[], src: T): void {
    src.swapContents(tgt[src.index]);
  }

  /** Swap the contents of the given items with the contents of the same-index items in the given vector. */
  public static exchangeAll<T extends Editable>(tgt: T[], src: T[]): void {
    src.forEach(item => this.exchange(tgt, item));
  }
}

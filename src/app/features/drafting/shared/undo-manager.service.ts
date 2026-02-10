/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { Deque } from '../../../shared/core/deque';
import { EditCommand, EditCommandPlaceholder } from '../../../shared/classes/editing';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';

export type EditCommandCompletionInfo = {
  kind: 'do' | 'undo' | 'redo';
  effectsMask: number;
  doneCount: number;
  undoneCount: number;
};

export interface UndoStateToken {}

@Injectable({ providedIn: 'root' })
export class UndoManagerService {
  public static readonly NO_EDIT_COMMAND = new EditCommandPlaceholder('[no edit command]');
  private static readonly MAX_DONE_COUNT: number = 1000;

  public readonly done: Deque<EditCommand> = new Deque<EditCommand>();
  public readonly undone: Deque<EditCommand> = new Deque<EditCommand>();

  constructor(private readonly eventBrokerService: EventBrokerService) {
    eventBrokerService.undoRequest.subscribe(info => this.undo(info.data));
    eventBrokerService.redoRequest.subscribe(info => this.redo(info.data));
    eventBrokerService.loadBridgeRequest.subscribe(() => this.clear());
  }

  /** Does the given command and adds it to the undo buffer. */
  public do(editCommand: EditCommand): void {
    editCommand.do();
    this.done.pushLeft(editCommand);
    while (this.done.length > UndoManagerService.MAX_DONE_COUNT) {
      this.done.popRight(); // In practice, only executes once.
    }
    this.undone.clear();
    this.emitCommandCompletion('do', editCommand.effectsMask);
  }

  /** Returns the command most recently done. Usable as a state token. */
  public get stateToken(): UndoStateToken {
    return this.done.peekLeft() || UndoManagerService.NO_EDIT_COMMAND;
  }

  /** Returns an index identifying the given state token in the undo/redo buffer. */
  public findStateTokenIndex(token: UndoStateToken): number | undefined {
    const doneLength = this.done.length;
    for (let i = 0; i < doneLength; ++i) {
      if (this.done.get(i) === token) {
        return i;
      }
    }
    const undoneLength = this.undone.length;
    for (let i = 0; i < undoneLength; ++i) {
      if (this.undone.get(i) === token) {
        return -1 - i;
      }
    }
    return undefined;
  }

  /** Uses index from `findStateTokenIndex` to fetch corresponding state token in the undo/redo buffer. */
  public getStateToken(index: number): UndoStateToken | undefined {
    return index >= 0 ? this.done.get(index) : this.undone.get(-1 - index);
  }

  // visible-for-testing
  undo(count: number): void {
    let effectsMask: number = 0;
    while (count-- > 0) {
      const editCommand = this.done.popLeft();
      if (!editCommand) {
        return;
      }
      editCommand.undo();
      effectsMask |= editCommand.effectsMask;
      this.undone.pushLeft(editCommand);
    }
    this.emitCommandCompletion('undo', effectsMask);
  }

  // visible-for-testing
  redo(count: number): void {
    let effectsMask: number = 0;
    while (count-- > 0) {
      const editCommand = this.undone.popLeft();
      if (!editCommand) {
        return;
      }
      editCommand.do();
      effectsMask |= editCommand.effectsMask;
      this.done.pushLeft(editCommand);
    }
    this.emitCommandCompletion('redo', effectsMask);
  }

  private emitCommandCompletion(kind: 'do' | 'undo' | 'redo', effectsMask: number): void {
    this.eventBrokerService.editCommandCompletion.next({
      origin: EventOrigin.SERVICE,
      data: {
        kind,
        effectsMask,
        doneCount: this.done.length,
        undoneCount: this.undone.length,
      },
    });
  }

  clear(): void {
    this.done.clear();
    this.undone.clear();
  }
}

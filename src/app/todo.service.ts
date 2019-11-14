import {Injectable} from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>({label: 'TodoList', items: []});

  private undoArray: TodoListData[] = [];
  private redoArray: TodoListData[] = [];

  constructor() {
    const prev = JSON.parse(localStorage['todoList']) as TodoListData;
    if (prev) {
      this.todoListSubject.next({
        label: prev.label,
        items: prev.items
      });
    }
  }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  storeLocal() {
    localStorage['todoList'] = JSON.stringify(this.todoListSubject.getValue());
  }

  save() {
    this.undoArray.push(this.todoListSubject.getValue());
    this.redoArray = [];
  }

  undo() {
    if (this.undoArray.length > 0) {
      this.redoArray.push(this.todoListSubject.getValue());
      this.todoListSubject.next(this.undoArray.pop());
    }
    this.storeLocal();
  }

  redo() {
    if (this.redoArray.length > 0) {
      this.undoArray.push(this.todoListSubject.getValue());
      this.todoListSubject.next(this.redoArray.pop());
    }
    this.storeLocal();
  }

  setItemsLabel(label: string, ...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}))
    });
    this.storeLocal();
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}))
    });
    this.storeLocal();
  }

  appendItems(...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: [...tdl.items, ...items]
    });
    this.storeLocal();
  }

  removeItems(...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => items.indexOf(I) === -1)
    });
    this.storeLocal();
  }

  removeDone() {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => I.isDone === false)
    });
    this.storeLocal();
  }

  removeAll() {
    this.save();
    this.todoListSubject.next({
      label: this.todoListSubject.getValue().label,
      items: []
    });
    this.storeLocal();
  }

}

import {Injectable} from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>({label: 'TodoList', items: []});

  constructor() {
    const prev = JSON.parse(localStorage.getItem('todoList')) as TodoListData;
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
    localStorage.setItem('todoList', JSON.stringify(this.todoListSubject.getValue()));
  }

  setItemsLabel(label: string, ...items: TodoItemData[]) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}))
    });
    this.storeLocal();
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[]) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}))
    });
    this.storeLocal();
  }

  appendItems(...items: TodoItemData[]) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: [...tdl.items, ...items]
    });
    this.storeLocal();
  }

  removeItems(...items: TodoItemData[]) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => items.indexOf(I) === -1)
    });
    this.storeLocal();
  }

  removeDone() {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => I.isDone === false)
    });
    this.storeLocal();
  }

}

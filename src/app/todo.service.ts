import {Inject, Injectable, InjectionToken} from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';
import {StorageService} from 'ngx-webstorage-service';

const STORAGE_KEY = 'toDoList';
export const TO_DO_STORAGE =
  new InjectionToken<StorageService>('TO_DO_STORAGE');

@Injectable()
export class TodoService {
  private todoListSubject = new BehaviorSubject<TodoListData>({label: 'TodoList', items: []});

  constructor(@Inject(TO_DO_STORAGE) private storage: StorageService) {
    const previousData: TodoListData = storage.get(STORAGE_KEY);
    if (previousData) {
      this.todoListSubject.next({
        label: previousData.label,
        items: previousData.items
      });
    }
  }

  update(items: TodoItemData[]) {
    this.todoListSubject.next({
      label: this.todoListSubject.getValue().label,
      items: items
    });
  }

  storeLocal() {
    this.storage.set(STORAGE_KEY, this.todoListSubject.getValue());
  }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
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

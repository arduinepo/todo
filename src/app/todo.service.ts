import {Injectable} from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

/*
 * Le ToDoService est utilisé par chaque component pour accéder aux données et les modifier,
 * par l'injection de dépendance. Les componentsse concentrent
 * sur leur rôle d'affichage et d'interface.
 */

@Injectable()
export class TodoService {
  /* Observable contenant les données de la todolist : permet d'envoyer les nouvelles données
  après modification à tous les objets s'y étant inscrits.
  */
  private todoListSubject = new BehaviorSubject<TodoListData>({label: 'TodoList', items: []});

  /* Contiennent les états précédents de la liste, stockés après toute modification directe.
  */
  private undoArray: TodoListData[] = [];
  private redoArray: TodoListData[] = [];

  /* Clé de la liste stockée en localStorage, pour le stockage et la récupération. */
  private STORAGE_KEY_TODO = 'todolist';
  private STORAGE_KEY_UNDO = 'undolist';
  private STORAGE_KEY_REDO = 'redolist';

  constructor() {
    this.loadStorage();
  }

  /* Récupère les données du localStorage.
  */
  loadStorage() {
    let prevTodo: TodoListData;
    if (localStorage[this.STORAGE_KEY_TODO]) {
      prevTodo = JSON.parse(localStorage[this.STORAGE_KEY_TODO]) as TodoListData;
      if (prevTodo) {
        this.todoListSubject.next({
          label: prevTodo.label,
          items: prevTodo.items
        });
      }
    }
    if (localStorage[this.STORAGE_KEY_UNDO]) {
      const undoStore = JSON.parse(localStorage[this.STORAGE_KEY_UNDO]) as TodoListData[];
      this.undoArray = undoStore.slice(undoStore.length > 100 ? undoStore.length - 100 : 0);
    }
    if (localStorage[this.STORAGE_KEY_REDO]) {
      this.redoArray = JSON.parse(localStorage[this.STORAGE_KEY_REDO]) as TodoListData[];
    }
  }

  /* Renvoit le todoListSubject en tant qu'observable, pour la souscription d'autres objets à ses modifications. */
  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  /* Le 6 méthodes suivantes sauvegardent l'état courant de la liste pour les undo/redo,
  la modifie et sauvegardent l'état modifié en localStorage.
  *Modifie le label d'une tâche de la liste.
  */
  setItemsLabel(label: string, ...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}))
    });
    this.storeLocal();
  }

  /* Modifie l'état accompli/à faire d'une tâche de la liste. */
  setItemsDone(isDone: boolean, ...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.map(I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}))
    });
    this.storeLocal();
  }

  /* Ajoute une ou plusieurs tâches à la liste. */
  appendItems(...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: [...tdl.items, ...items]
    });
    this.storeLocal();
  }

  /* Supprime une ou plusieurs tâches de la liste. */
  removeItems(...items: TodoItemData[]) {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => items.indexOf(I) === -1)
    });
    this.storeLocal();
  }

  /* Supprime toutes les tâches accomplies. */
  removeDone() {
    this.save();
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next({
      label: tdl.label,
      items: tdl.items.filter(I => I.isDone === false)
    });
    this.storeLocal();
  }

  /* Supprime toutes les tâches. */
  removeAll() {
    this.save();
    this.todoListSubject.next({
      label: this.todoListSubject.getValue().label,
      items: []
    });
    this.storeLocal();
  }

  /* Sauvegarde en localStorage l'état courant de la liste */
  storeLocal() {
    localStorage[this.STORAGE_KEY_TODO] = JSON.stringify(this.todoListSubject.getValue());
    localStorage[this.STORAGE_KEY_UNDO] = JSON.stringify(this.undoArray.slice(this.undoArray.length > 100 ? this.undoArray.length - 100 : 0));
    localStorage[this.STORAGE_KEY_REDO] = JSON.stringify(this.redoArray);
  }

  /* Sauvegarde l'état courant de la liste pour l'annulation de la modification suivante. */
  save() {
    this.undoArray.push(this.todoListSubject.getValue());
    this.redoArray = [];
  }

  /* Sauvegarde l'état courant de la liste pour permettre l'option Refaire(redo), et récupère l'état précédent.
  Efficace seulement si l'état précédent existe en mémoire application. */
  undo() {
    if (this.undoArray.length > 0) {
      this.redoArray.push(this.todoListSubject.getValue());
      this.todoListSubject.next(this.undoArray.pop());
    }
    this.storeLocal();
  }

  /* Renvoit vrai si l'état précédent de la liste existe en mémoire application. */
  undoable() {
    return this.undoArray.length > 0;
  }

  /* Sauvegarde l'état courant de la liste pour permettre l'option Annuler(undo), et récupère l'état précédant l'annulation.
  Efficace seulement si l'état précédant l'annulation existe en mémoire application. */
  redo() {
    if (this.redoArray.length > 0) {
      this.undoArray.push(this.todoListSubject.getValue());
      this.todoListSubject.next(this.redoArray.pop());
    }
    this.storeLocal();
  }

  /* Renvoit vrai si la dernière action a été annulée et l'état précédant sauvegardé en mémoire application. */
  redoable() {
    return this.redoArray.length > 0;
  }

}

import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

/*
 * Component chargé d'afficher le contenu d'une TodoListData transmise par un TodoService, et de recueillir les données entrées par l'utilisateur,
 * pour les transférer au TodoService injecté en dépendance.
 */

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  /*
  * Données en lecture : l'instance de cette classe est liée à un TodoListData.
  * Cette classe appelle des méthodes du ToDoService pour les modifier.
  */
  @Input() private data: TodoListData;
  @ViewChild('newTodoInput', {static: false}) newTodoInput: ElementRef;
  /*
  * Filtre d'affichage des items de la liste : est modifié par les clics de l'utilisateur sur les balises .filters.
  */
  _filter: string;

  /*
  * Observe les données du ToDoService, met à jour ses propres données à chaque modification.
  * Initialise le filtre à 'all' par défaut.
  */
  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe(tdl => this.data = tdl);
    this.filter = 'all';
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data.label;
  }

  /*
  * Getter, renvoyant les items en fonction du filtre courant.
  */
  get items(): TodoItemData[] {
    switch (this._filter) {
      case('all'):
        return this.data.items;
      case('undone'):
        return this.data.items.filter(i => i.isDone === false);
      case('done'):
        return this.data.items.filter(i => i.isDone === true);
    }
  }

  /*
  * Ajoute un item à la liste
  */
  appendItem(label: string) {
    this.todoService.appendItems({
      label,
      isDone: false
    });
  }

  /*
  * Supprime toutes les tâches cochées de la liste.
  */
  removeDone() {
    this.todoService.removeDone();
  }

  /*
  * Renvoit vrai si toutes les tâches de la liste sont côchées.
  */
  isAllDone(): boolean {
    return this.data.items.every(it => it.isDone) || false;
  }

  /*
  * Coche toutes les tâches si elles ne sont pas toutes cochées, sinon les déchoche toutes.
  */
  toggleAllDone() {
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.items);
  }

  get filter() {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
  }

  /*
  * Retourne le nombre de tâches non cochées.
  */
  numberLeft(): number {
    return this.data.items.reduce((acc, cur) => acc + (cur.isDone ? 0 : 1), 0);
  }

  /*
  * Supprime toutes les tâches de la liste
  */
  removeAll() {
    this.todoService.removeAll();
  }

  /*
  * Annule la dernière action.
  */
  undo() {
    this.todoService.undo();
  }

  /*
  * Annule le dernier undo non annulé.
  */
  redo() {
    this.todoService.redo();
  }

  /*
  * Renvoit vrai si la dernière action peut être annulée pour revenir à l'état précédent.
  */
  undoable(): boolean {
    return this.todoService.undoable();
  }

  /*
  * Renvoit vrai si la précédente annulation peut être elle-même annulée pour revenir à l'état précédent.
  */
  redoable(): boolean {
    return this.todoService.redoable();
  }

  /*
  * Renvoit vrai si la liste est vide.
  */
  isEmpty(): boolean {
    return this.data.items.length === 0;
  }

  recordSpeech() {
    //   this.todoService.recordSpeech();
  }

}

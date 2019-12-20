import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {TodoService} from '../todo.service';
import {TodoItemData} from '../dataTypes/TodoItemData';

/*
 * COmponent chargé d'afficher le contenu d'un TodoItemData, et de recueillir les données entrées par l'utilisateur,
 * pour les transférer au TodoService injecté en dépendance.
 */

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  /*
  * Données en lecture : chaque instance est liée à un TodoItemData.
  */
  @Input() private data: TodoItemData;
  @ViewChild('newTextInput', {static: false}) private inputLabel: ElementRef;
  /*
  * Booléen précisant l'état courant de l'item sur la page html : en cours d'édition par l'utilisateur ou non.
  */
  private _editionMode = false;

  constructor(private todoService: TodoService) {
  }

  ngOnInit() {
  }

  get editionMode(): boolean {
    return this._editionMode;
  }

  /* Bascule l'état d'édition de l'item vers true ou false.
   */
  set editionMode(e: boolean) {
    this._editionMode = e;
    requestAnimationFrame(() => this.inputLabel.nativeElement.focus());
  }

  get label(): string {
    return this.data.label;
  }

  /* Modifie le label
   */
  set label(lab: string) {
    this.todoService.setItemsLabel(lab, this.data);
  }

  get isDone(): boolean {
    return this.data.isDone;
  }

  /* Modifie l'état de complétion de l'item.
   */
  set isDone(done: boolean) {
    this.todoService.setItemsDone(done, this.data);
  }

  /*
  * Supprime le TodoItemData lié à cet ItemComponent.
  */
  destroy() {
    this.todoService.removeItems(this.data);
  }
}

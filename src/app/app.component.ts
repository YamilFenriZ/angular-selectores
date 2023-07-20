import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith, debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'selectores';
  paises: string[] = [
    "Bolivia", "Noruega", "Georgia", "España", "Estados Unidos", "Dubai"
  ]
  control = new FormControl();
  filtroPaises: Observable<string[]> = new Observable<string[]>();

  constructor(){}
  ngOnInit(): void {
    this.filtroPaises = this.control.valueChanges.pipe(
      debounceTime(600),
      startWith(''),
      map( valor => this._filtro(valor))
    );
  }

  private _filtro(valor: string): string[]{
    const valorFormateado = valor.toLowerCase();
    //return this.paises.filter(pais => pais.toLowerCase().indexOf(valorFormateado) === 0);
    return this.paises.filter(pais => pais.toLowerCase().includes(valorFormateado));

  }

  redireccionar() {
    // Redirigir a la URL del PDF
    //window.location.href = 'https://dagrs.berkeley.edu/sites/default/files/2020-01/sample.pdf';
    window.open('https://dagrs.berkeley.edu/sites/default/files/2020-01/sample.pdf', '_blank');
  }

}

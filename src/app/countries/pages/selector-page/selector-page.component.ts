import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { Observable, debounceTime, filter, map, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region : ['', Validators.required ],
    country: ['', Validators.required ],
    border: ['', Validators.required ],
  })

  paises: string[] = [
    "Bolivia", "Noruega", "Georgia", "España", "Estados Unidos", "Dubai"
  ]
  control = new FormControl();
  filtroPaises: Observable<string[]> = new Observable<string[]>();

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ){}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
    this.filtroPaises = this.control.valueChanges.pipe(
      debounceTime(600),
      startWith(''),
      map( valor => this._filtro(valor))
    );
  }

  get regions():Region[]{
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('') ),
        tap(() => this.borders = [] ),
        //switchMap( this.countriesService.getCountriesByRegion )
        switchMap( region => this.countriesService.getCountriesByRegion(region) )
      )
      .subscribe( countries => {
        this.countriesByRegion = countries
      });
  }

  onCountryChanged(): void{
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('') ),
        filter( (value: string) => value.length > 0 ),
        //switchMap( this.countriesService.getCountriesByRegion )
        switchMap( alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode) ),
        switchMap( country => this. countriesService.getCountryBordersByCodes( country.borders ))

      )
      .subscribe( countries => {
        // this.countriesByRegion = countries
        // console.log({ borders: country.borders });
        this.borders = countries;

      });
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

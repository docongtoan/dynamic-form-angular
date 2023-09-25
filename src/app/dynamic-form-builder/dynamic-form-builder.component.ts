import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dynamic-form-builder',
  template: `
    <form
      (ngSubmit)="onSubmit.emit(this.form.value)"
      [formGroup]="form"
      class="form-horizontal"
    >
      <div *ngFor="let field of fields">
        <field-builder [field]="field" [form]="form"></field-builder>
      </div>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">
          <button
            type="submit"
            [disabled]="!form.valid"
            class="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormBuilderComponent implements OnInit , OnDestroy {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  @Output() ChangeValue = new EventEmitter();
  form: FormGroup;
  constructor() {}
  ngOnInit() {
    this.HandleForm.init();
    this.form.valueChanges.subscribe((res)=> {
      this.HandleForm.emitValueChange(res);
    });
  }

  HandleForm = {
    init: () => {
      let fieldsCtrls: any = {};
      for (let f of this.fields) {
        if (f.type != 'checkbox') {
          fieldsCtrls[f.name] = new FormControl(
            f.value || '',
            Validators.required
          );
        } else {
          let opts: any = {};
          for (let opt of f.options) {
            opts[opt.key] = new FormControl(opt.value);
          }
          fieldsCtrls[f.name] = new FormGroup(opts);
        }
      }
      this.form = new FormGroup(fieldsCtrls);
    },
    emitValueChange: (value: any)=> {
      this.ChangeValue.emit(value);
    }
  };
  ngOnDestroy(): void {
      
  }
}

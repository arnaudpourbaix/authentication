import {AbstractControl, FormControl, FormGroup, FormArray} from '@angular/forms';
import {Observable} from 'rxjs';

export type STATUS = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';
export type STATUSs = STATUS | string;

export interface AbstractControlTyped<T> extends AbstractControl {
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V>(value: V extends T ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
}

export interface FormControlTyped<T> extends FormControl {
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V>(value: V extends T ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
}

export interface FormGroupTyped<T> extends FormGroup {
  readonly value: T;
  valueChanges: Observable<T>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  controls: {[P in keyof T]: AbstractControlTyped<T[P]>};
  registerControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): AbstractControlTyped<T[P]>;
  registerControl<V = any>(name: string, control: AbstractControlTyped<V>): AbstractControlTyped<V>;
  addControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): void;
  addControl<V = any>(name: string, control: AbstractControlTyped<V>): void;
  removeControl(name: keyof T): void;
  removeControl(name: string): void;
  setControl<P extends keyof T>(name: P, control: AbstractControlTyped<T[P]>): void;
  setControl<V = any>(name: string, control: AbstractControlTyped<V>): void;
  contains(name: keyof T): boolean;
  contains(name: string): boolean;
  get<P extends keyof T>(path: P): AbstractControlTyped<T[P]>;
  getRawValue(): T & {[disabledProp in string | number]: any};
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V>(value: V extends T ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  patchValue<V>(value: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  reset<V>(value?: V extends Partial<T> ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
}

export interface FormArrayTyped<T> extends FormArray {
  readonly value: T[];
  valueChanges: Observable<T[]>;
  readonly status: STATUSs;
  statusChanges: Observable<STATUS>;
  controls: AbstractControlTyped<T>[];
  at(index: number): AbstractControlTyped<T>;
  push<V = T>(ctrl: AbstractControlTyped<V>): void;
  insert<V = T>(index: number, control: AbstractControlTyped<V>): void;
  setControl<V = T>(index: number, control: AbstractControlTyped<V>): void;
  getRawValue(): T[];
  get<V = unknown>(path: Array<string | number> | string): AbstractControlTyped<V> | null;
  setValue<V>(value: V extends T[] ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  patchValue<V>(value: V extends Partial<T>[] ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
  reset<V>(value?: V extends Partial<T>[] ? V : never, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;
}

import { Store } from 'vuex'

export interface Statics {
  _store: Store<any>
  [k: string]: any
}

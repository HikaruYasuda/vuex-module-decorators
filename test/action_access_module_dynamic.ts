import Vuex, { Module as Mod, Store } from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule } from '..'
import { expect } from 'chai'
import {getModule} from '../src/vuexmodule'

const store = new Vuex.Store({})

@Module({name: 'mm', dynamic: true, store})
class MyModule extends VuexModule {
  fieldFoo = 'foo'
  fieldBar = 'bar'

  @Mutation
  setFoo(data: string) {
    this.fieldFoo += data
  }
  @Mutation
  setBar(data: string) {
    this.fieldBar += data
  }

  @Action
  async concatFooOrBar(newstr: string) {
    if (this.fieldFoo.length < this.fieldBar.length) {
      this.setFoo(newstr)
    } else {
      this.setBar(newstr)
    }
  }
}


describe('@Action with dynamic module', () => {
  it('should concat foo & bar (promise)', function(done) {
    const mm = getModule(MyModule)
    store
      .dispatch('concatFooOrBar', 't1')
      .then(() => {
        expect(mm.fieldBar).to.equal('bart1')
      })
      .then(() => {
        store.dispatch('concatFooOrBar', 't1').then(() => {
          expect(mm.fieldFoo).to.equal('foot1')
        })
        done()
      })
      .catch(done)
  })

  it('should concat foo & bar (await)', async function() {
    const mm = getModule(MyModule)
    await store.dispatch('concatFooOrBar', 't1')
    expect(mm.fieldBar).to.equal('bart1t1')
    await store.dispatch('concatFooOrBar', 't1')
    expect(mm.fieldFoo).to.equal('foot1t1')
  })
})
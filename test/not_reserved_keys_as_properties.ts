import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { Action, Module, Mutation, VuexModule, getModule } from '..'
import { expect } from 'chai'

describe('using not reserved property names works', () => {
  it('should work "store" as mutation', async function () {
    const store = new Vuex.Store({})

    @Module({ dynamic: true, store, name: 'mm' })
    class MyModule extends VuexModule {
      foo: string = ''

      @Mutation
      store(data: string) {
        this.foo = data
      }
    }

    const mm = getModule(MyModule)
    store.commit('store', 'foo')
    expect(mm.foo).to.equal('foo')
  })

  it('should work "store" as action', async function () {
    const store = new Vuex.Store({})

    @Module({ dynamic: true, store, name: 'mm' })
    class MyModule extends VuexModule {
      foo: string = ''

      @Mutation
      setFoo(data: string) {
        this.foo = data
      }

      @Action
      async store(data: string) {
        this.setFoo(data)
      }
    }

    const mm = getModule(MyModule)
    await store.dispatch('store', 'foo')
    expect(mm.foo).to.equal('foo')
  })
})

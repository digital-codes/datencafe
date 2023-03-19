const { describe, expect, test } = require('@jest/globals');


const { defineStore } = require('pinia');

describe('Pinia Store', () => {
	  let store;

	  beforeEach(() => {
		      store = defineStore('test', {
			            state: () => ({
					            items: [],
					          }),
			            actions: {
					            add(item) {
							              this.items.push(item);
							            },
					            update(index, item) {
							              this.items.splice(index, 1, item);
							            },
					            remove(index) {
							              this.items.splice(index, 1);
							            },
					            get(index) {
							              return this.items[index];
							            },
					          },
			          })();

		      store.add('item1');
		      store.add('item2');
		    });

	  afterEach(() => {
		      store.$reset();
		    });

	  it('should add an item to the store', () => {
		      store.add('item3');

		      expect(store.items).toEqual(['item1', 'item2', 'item3']);
		    });

	  it('should update an item in the store', () => {
		      store.update(0, 'newItem1');

		      expect(store.items).toEqual(['newItem1', 'item2']);
		    });

	  it('should remove an item from the store', () => {
		      store.remove(0);

		      expect(store.items).toEqual(['item2']);
		    });

	  it('should get an item from the store', () => {
		      const item = store.get(0);

		      expect(item).toEqual('item1');
		    });
});



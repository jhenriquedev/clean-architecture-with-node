const Chance = require('chance');

const chance = new Chance();

const { cloneDeep } = require('lodash');

const { productsRepository } = require('../../../src/frameworks/repositories/inMemory');

const { Product } = require('../../../src/entities');


describe('Product repository', () => {
    test('New product should be added and return.', async () => {
        let testProduct = new Product({
            name: chance.name(),
            description: chance.sentence(),
            images: [ chance.url(), chance.url() ],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                deliver: {
                    from: 'China',
                }
            },
        });

        let addedProduct = await productsRepository.add(testProduct);
        expect(addedProduct).toBeDefined();
        expect(addedProduct.id).toBeDefined();
        expect(addedProduct.name).toBe(testProduct.name);
        expect(addedProduct.description).toBe(testProduct.description);
        expect(addedProduct.images).toEqual(testProduct.images);
        expect(addedProduct.price).toBe(testProduct.price);
        expect(addedProduct.color).toBe(testProduct.color);
        expect(addedProduct.meta).toEqual(testProduct.meta);

        expect(await productsRepository.getById(addedProduct.id));

    });

    test('New product should be deleted.', async () => {
        //init two products
        let testProduct = new Product({
            name: chance.name(),
            description: chance.sentence(),
            images: [ chance.url(), chance.url() ],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                deliver: {
                    from: 'China',
                }
            },
        });
    
        let testProduct2 = new Product({
            name: chance.name(),
            description: chance.sentence(),
            images: [ chance.url(), chance.url() ],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                deliver: {
                    from: 'Brazil',
                }
            },
        });
        // Add two 
        let [
            addedProduct1,
            addedProduct2,
        ] = await Promise.all([
            productsRepository.add(testProduct),
            productsRepository.add(testProduct2),
        ]);

        expect(addedProduct1).toBeDefined();
        expect(addedProduct2).toBeDefined();
        
         // Delete 
         expect(await productsRepository.delete(addedProduct1)).toEqual(testProduct);

         // try to get the deleted ( should be undefined )
         expect(await productsRepository.getById(addedProduct1.id)).toBeUndefined();
        
         // Check that the second  defined ( not deleted )  
         expect(await productsRepository.getById(addedProduct2.id)).toBeDefined();
    });
    test('New product should be updated.', async () => {
        // Init one user
        let testProduct = new Product({
            name: chance.name(),
            description: chance.sentence(),
            images: [ chance.url(), chance.url() ],
            price: chance.natural(),
            color: chance.color(),
            meta: {
                deliver: {
                    from: 'Brazil',
                }
            },
        });

        //add one
        let addedProduct = await productsRepository.add(testProduct);
        expect(addedProduct).toBeDefined();

        const clonedProduct = cloneDeep({
            ...addedProduct,
            name: chance.name(),
            description: chance.sentence(),
        });

        //update 
        const updatedProduct = await productsRepository.update(clonedProduct);
        expect(updatedProduct).toEqual(clonedProduct);
        expect(updatedProduct.id).toEqual(addedProduct.id);
        expect(updatedProduct !== addedProduct ? true : false).toEqual(true);
    });
});
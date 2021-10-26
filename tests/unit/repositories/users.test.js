const Chance = require('chance');

const chance = new Chance();

const { cloneDeep } = require('lodash');

const {
    usersRepository
} = require('../../../src/frameworks/repositories/inMemory');
const {
    User,
    userConsts: {
        userConstants: {
            genders,
        },
    },
} = require('../../../src/entities');


describe('User repository', () => {
    
    test('New user should be added and return.', async () => {
        let testUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'black',
                },
            },
        });

        let addedUser = await usersRepository.add(testUser);

        expect(addedUser).toBeDefined();
        expect(addedUser.id).toBeDefined();
        expect(addedUser.name).toBe(testUser.name);
        expect(addedUser.lastName).toBe(testUser.lastName);
        expect(addedUser.gender).toBe(testUser.gender);
        expect(addedUser.meta).toEqual(testUser.meta);

        let returnedUser = await usersRepository.getById(testUser.id);
        expect(returnedUser).toEqual(addedUser);
    });

    test('New user should be deleted.', async () => {
        // Init two users 
        let testUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'black',
                },
            },
        });
        let testUserTwo = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.MALE,
            meta: {
                hair: {
                    color: 'blonde',
                },
            },
        });
    
        // Add two users
        let [
            addedUser,
            addedUserTwo,
        ] = await Promise.all([
            usersRepository.add(testUser),
            usersRepository.add(testUserTwo),
        ]);
        

        expect(addedUser).toBeDefined();
        expect(addedUserTwo).toBeDefined();

        // Delete one user 
        expect(await usersRepository.delete(addedUser)).toEqual(addedUser);

        // try to get the deleted user ( should be undefined )
        expect(await usersRepository.getById(addedUser.id)).toBeUndefined();
       
        // Check that the second user defined ( not deleted )  
        expect(await usersRepository.getById(addedUserTwo.id)).toBeDefined();
    });
    test('New user should be updated', async () => {
        // Init one user
        let testUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'red',
                },
            },
        });

        //add one user 
        let addedUser = await usersRepository.add(testUser);
        expect(addedUser).toBeDefined();

        const clonedUser = cloneDeep({
            ...addedUser,
            name: chance.name(),
            gender: genders.MALE,
        });

        //update 
        const updatedUser = await usersRepository.update(clonedUser);
        expect(updatedUser).toEqual(clonedUser);
        expect(updatedUser.id).toEqual(addedUser.id);
        expect(updatedUser !== addedUser ? true : false).toEqual(true);
    });
});
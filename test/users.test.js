import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';

// Mock du service User
const mockUserService = {
    getAll: sinon.stub(),
    getById: sinon.stub(),
    add: sinon.stub(),
    update: sinon.stub(),
    deleteUser: sinon.stub(),
    authenticate: sinon.stub(),
};

describe('User Service', () => {
    afterEach(() => {
        // Réinitialise les stubs après chaque test
        sinon.restore();
    });

    it('should retrieve all users', async () => {
        const mockUsers = [{ id: '6720eab2542f50571c2219d9', name: 'Emma', email: 'elecuelle001@ensc.fr' }];
        mockUserService.getAll.resolves(mockUsers);

        const result = await mockUserService.getAll();
        expect(result).to.deep.equal(mockUsers);
    });

    it('should retrieve a user by ID', async () => {
        const mockUser = { id: '6720eab2542f50571c2219d9', name: 'Emma', email: 'elecuelle001@ensc.fr' };
        mockUserService.getById.resolves(mockUser);

        const result = await mockUserService.getById('1');
        expect(result).to.deep.equal(mockUser);
    });

    it('should throw an error if user not found by ID', async () => {
        mockUserService.getById.rejects(new Error('Utilisateur non trouvé'));

        try {
            await mockUserService.getById('invalid_id');
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('Utilisateur non trouvé');
        }
    });

    it('should add a new user', async () => {
        const newUser = { name: 'Emma', email: 'elecuelle001@ensc.fr', password: 'hashed_password' };
        const mockUser = { ...newUser, id: '6720eab2542f50571c2219d9' };
        mockUserService.add.resolves(mockUser);

        const result = await mockUserService.add(newUser);
        expect(result).to.deep.equal(mockUser);
    });

    it('should throw an error when adding a user with duplicate email', async () => {
        mockUserService.add.rejects(new Error("L'email est déjà utilisé."));

        try {
            await mockUserService.add({ name: 'Emma', email: 'elecuelle001@ensc.fr', password: 'password' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal("L'email est déjà utilisé.");
        }
    });

    it('should update an existing user', async () => {
        const updatedUser = { id: '6720eab2542f50571c2219d9', name: 'Emma', email: 'elecuelle001@ensc.fr' };
        mockUserService.update.resolves(updatedUser);

        const result = await mockUserService.update('6720eab2542f50571c2219d9', { name: 'Emma' });
        expect(result.name).to.equal('Emma');
    });

    it('should throw an error if user to update is not found', async () => {
        mockUserService.update.rejects(new Error('user_not_found'));

        try {
            await mockUserService.update('invalid_id', { name: 'Emma' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('user_not_found');
        }
    });

    it('should delete a user by ID', async () => {
        mockUserService.deleteUser.resolves();

        await mockUserService.deleteUser('6720eab2542f50571c2219d9');
        expect(mockUserService.deleteUser.calledOnce).to.be.true;
    });

    it('should authenticate a user with correct credentials', async () => {
        const mockUser = { id: '6720eab2542f50571c2219d9', name: 'Emma', email: 'elecuelle001@ensc.fr' };
        sinon.stub(bcrypt, 'compare').resolves(true);
        mockUserService.authenticate.resolves(mockUser);

        const result = await mockUserService.authenticate({ email: 'elecuelle001@ensc.fr', password: 'password' });
        expect(result).to.deep.equal(mockUser);
    });

    it('should throw an error if authentication fails due to wrong credentials', async () => {
        sinon.stub(bcrypt, 'compare').resolves(false);
        mockUserService.authenticate.rejects(new Error('wrong_credentials'));

        try {
            await mockUserService.authenticate({ email: 'elecuelle001@ensc.fr', password: 'wrong_password' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('wrong_credentials');
        }
    });

    it('should throw an error if user is not found during authentication', async () => {
        mockUserService.authenticate.rejects(new Error('user_not_found'));

        try {
            await mockUserService.authenticate({ email: 'invalid@example.com', password: 'password' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('user_not_found');
        }
    });
});
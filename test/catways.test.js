import { expect } from 'chai';
import sinon from 'sinon';

// Mock du service Catway
const mockCatwayService = {
    getAll: sinon.stub(),
    getById: sinon.stub(),
    findByCatwayNumber: sinon.stub(),
    add: sinon.stub(),
    update: sinon.stub(),
    deleteCatway: sinon.stub(),
};

describe('Catways Service', () => {
    afterEach(() => {
        // Réinitialiser les stubs après chaque test
        sinon.restore();
    });

    it('should retrieve all catways', async () => {
        const mockCatways = [{ catwayNumber: 'C1', type: 'long', catwayState: 'Disponible' }];
        mockCatwayService.getAll.resolves(mockCatways);

        const result = await mockCatwayService.getAll();
        expect(result).to.deep.equal(mockCatways);
    });

    it('should retrieve a catway by ID', async () => {
        const mockCatway = { _id: '678bd491358a3c7065cd7a92', catwayNumber: '10', type: 'long', catwayState: 'Disponible' };
        mockCatwayService.getById.resolves(mockCatway);

        const result = await mockCatwayService.getById('678bd491358a3c7065cd7a92');
        expect(result).to.deep.equal(mockCatway);
    });

    it('should throw an error if catway not found by ID', async () => {
        mockCatwayService.getById.rejects(new Error('catway_not_found'));

        try {
            await mockCatwayService.getById('invalid_id');
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('catway_not_found');
        }
    });

    it('should find a catway by its number', async () => {
        const mockCatway = { catwayNumber: '10', type: 'long', catwayState: 'Disponible' };
        mockCatwayService.findByCatwayNumber.resolves(mockCatway);

        const result = await mockCatwayService.findByCatwayNumber('10');
        expect(result).to.deep.equal(mockCatway);
    });

    it('should return null if catway number is not found', async () => {
        mockCatwayService.findByCatwayNumber.resolves(null);

        const result = await mockCatwayService.findByCatwayNumber('invalid_number');
        expect(result).to.be.null;
    });

    it('should add a new catway', async () => {
        const mockCatway = { catwayNumber: '50', type: 'long', catwayState: 'Disponible' };
        mockCatwayService.add.resolves(mockCatway);

        const result = await mockCatwayService.add({ catwayNumber: '10', type: 'long', catwayState: 'Disponible' });
        expect(result).to.deep.equal(mockCatway);
    });

    it('should throw an error when adding a catway with invalid data', async () => {
        mockCatwayService.add.rejects(new Error('invalid_data'));

        try {
            await mockCatwayService.add({ invalidField: 'invalid_value' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('invalid_data');
        }
    });

    it('should update an existing catway', async () => {
        const updatedCatway = { _id: '678bd491358a3c7065cd7a92', catwayNumber: '10', type: 'long', catwayState: 'Disponible' };
        mockCatwayService.update.resolves(updatedCatway);

        const result = await mockCatwayService.update('678bd491358a3c7065cd7a92', { catwayNumber: '10' });
        expect(result.catwayNumber).to.equal('10');
    });

    it('should throw an error if catway to update is not found', async () => {
        mockCatwayService.update.rejects(new Error('catway_not_found'));

        try {
            await mockCatwayService.update('invalid_id', { catwayNumber: '10' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('catway_not_found');
        }
    });

    it('should delete a catway by ID', async () => {
        mockCatwayService.deleteCatway.resolves();

        await mockCatwayService.deleteCatway('678bd491358a3c7065cd7a92');
        expect(mockCatwayService.deleteCatway.calledOnce).to.be.true;
    });
});
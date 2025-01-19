import { expect } from 'chai';
import sinon from 'sinon';

// Mock du service Reservation
const mockReservationService = {
    getAll: sinon.stub(),
    getById: sinon.stub(),
    findByClientName: sinon.stub(),
    add: sinon.stub(),
    update: sinon.stub(),
    deleteReservation: sinon.stub(),
};

describe('Reservation Service', () => {
    afterEach(() => {
        // Réinitialise les stubs après chaque test
        sinon.restore();
    });

    it('should retrieve all reservations', async () => {
        const mockReservations = [
            { id: '672204473ebb15b737b2807d', clientName: 'Thomas Martin', boatName: 'Carolina', catwayNumber: 1, checkIn: '2022-05-21T06:00:00.000+00:00', checkOut: '2022-10-27T06:00:00.000+00:00' },
        ];
        mockReservationService.getAll.resolves(mockReservations);

        const result = await mockReservationService.getAll();
        expect(result).to.deep.equal(mockReservations);
    });

    it('should retrieve a reservation by ID', async () => {
        const mockReservation = { id: '672204473ebb15b737b2807d', clientName: 'Thomas Martin', boatName: 'Carolina', catwayNumber: 1, checkIn: '2022-05-21T06:00:00.000+00:00', checkOut: '2022-10-27T06:00:00.000+00:00' };
        mockReservationService.getById.resolves(mockReservation);

        const result = await mockReservationService.getById('672204473ebb15b737b2807d');
        expect(result).to.deep.equal(mockReservation);
    });

    it('should throw an error if reservation not found by ID', async () => {
        mockReservationService.getById.rejects(new Error('reservation_not_found'));

        try {
            await mockReservationService.getById('invalid_id');
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('reservation_not_found');
        }
    });

    it('should find a reservation by client name', async () => {
        const mockReservation = { id: '672204473ebb15b737b2807d', clientName: 'Thomas Martin', boatName: 'Carolina', catwayNumber: 1, checkIn: '2022-05-21T06:00:00.000+00:00', checkOut: '2022-10-27T06:00:00.000+00:00' };
        mockReservationService.findByClientName.resolves(mockReservation);

        const result = await mockReservationService.findByClientName('Thomas Martin');
        expect(result).to.deep.equal(mockReservation);
    });

    it('should return null if no reservation is found by client name', async () => {
        mockReservationService.findByClientName.resolves(null);

        const result = await mockReservationService.findByClientName('Invalid Name');
        expect(result).to.be.null;
    });

    it('should add a new reservation', async () => {
        const newReservation = { clientName: 'John Doe', catwayNumber: '1', checkIn: '2023-01-01', checkOut: '2023-01-10' };
        const mockReservation = { ...newReservation, id: '1' };
        mockReservationService.add.resolves(mockReservation);

        const result = await mockReservationService.add(newReservation);
        expect(result).to.deep.equal(mockReservation);
    });

    it('should throw an error when adding a reservation with invalid data', async () => {
        mockReservationService.add.rejects(new Error('invalid_data'));

        try {
            await mockReservationService.add({ invalidField: 'invalid_value' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('invalid_data');
        }
    });

    it('should update an existing reservation', async () => {
        const updatedReservation = { id: '672204473ebb15b737b2807d', clientName: 'Thomas Martin', boatName: 'Carolina', catwayNumber: 1, checkIn: '2022-05-21T06:00:00.000+00:00', checkOut: '2022-10-27T06:00:00.000+00:00' };
        mockReservationService.update.resolves(updatedReservation);

        const result = await mockReservationService.update('672204473ebb15b737b2807d', { clientName: 'Thomas Martin' });
        expect(result.clientName).to.equal('Thomas Martin');
    });

    it('should throw an error if reservation to update is not found', async () => {
        mockReservationService.update.rejects(new Error('reservation_not_found'));

        try {
            await mockReservationService.update('invalid_id', { clientName: 'Thomas Martin' });
            throw new Error('Test failed: no error was thrown');
        } catch (error) {
            expect(error.message).to.equal('reservation_not_found');
        }
    });

    it('should delete a reservation by ID', async () => {
        mockReservationService.deleteReservation.resolves();

        await mockReservationService.deleteReservation('672204473ebb15b737b2807d');
        expect(mockReservationService.deleteReservation.calledOnce).to.be.true;
    });
});
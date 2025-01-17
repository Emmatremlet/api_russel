import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const { expect } = chai;

chai.use(chaiHttp);

describe('Catways API', () => {
    // Test pour récupérer la liste des catways
    it('should return a list of catways', (done) => {
        chai.request(app)
            .get('/catways')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    // Test pour récupérer un catway spécifique
    it('should return a specific catway', (done) => {
        const catwayId = '1';
        chai.request(app)
            .get(`/catways/${catwayId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('catwayNumber');
                done();
            });
    });

    // Test pour créer un nouveau catway
    it('should create a new catway', (done) => {
        const newCatway = {
            catwayNumber: '456',
            type: 'long',
            catwayState: 'available'
        };
        chai.request(app)
            .post('/catways')
            .send(newCatway)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('catwayNumber', '456');
                done();
            });
    });

    // Test pour modifier un catway existant
    it('should update an existing catway', (done) => {
        const catwayId = '1'; 
        const updatedCatway = {
            type: 'short',
            catwayState: 'unavailable'
        };
        chai.request(app)
            .put(`/catways/${catwayId}`)
            .send(updatedCatway)
            .end((err, res) => {
                expect(res).to.have.status(200); 
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('type', 'short');
                done();
            });
    });

    // Test pour supprimer un catway
    it('should delete an existing catway', (done) => {
        const catwayId = '456'; 
        chai.request(app)
            .delete(`/catways/${catwayId}`)
            .end((err, res) => {
                expect(res).to.have.status(204);
                done();
            });
    });

    // Test pour gérer une ressource inexistante
    it('should return 404 for a non-existent catway', (done) => {
        const invalidCatwayId = 'nonexistent';
        chai.request(app)
            .get(`/catways/${invalidCatwayId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                done();
            });
    });
});
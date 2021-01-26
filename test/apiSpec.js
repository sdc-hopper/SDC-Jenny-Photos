const chai = require('chai'), chaiHttp = require('chai-http'), { expect } = require('chai');
const app = require('../server/index.js');

chai.use(chaiHttp);
chai.should();

describe('API calls', () => {

    let requester;

    before(async () => {
      requester = await chai.request(app).keepOpen();
    });

    describe('Single product API call - GET /photos/id/:productId', () => {
      // valid ids are 1000-1099
      const id = 1000;
      const invalidId = 100;

      it('should get all pictures related to a product\'s id', (done) => {
        requester.get(`/photos/id/${id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body).to.have.property('primaryUrl');
            expect(res.body).to.have.property('productUrls');
            done();
          });
      });

      it('should respond with a 400 status code when requesting an invalid product id', (done) => {
        requester.get(`/photos/id/${invalidId}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe('Multiple products API call - POST /photos/product/primary/multiple', () => {
      // valid ids are 1000-1099
      const ids = [1000, 1005, 1010, 1085];

      it('should get multiple products\' primary photo urls', (done) => {
        requester.post('/photos/product/primary/multiple')
          .send(ids)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(Object.keys(res.body).length).to.equal(ids.length);
            done();
          });
      });

      it('should respond with a 404 status code when requesting too many product ids', (done) => {
        let requestLimit = 30;
        let tooManyProductIds = [];
        // push 31 valid ids into an array to send with the request
        for (let i = 0; i <= requestLimit; i++) {
          tooManyProductIds.push(i + 1000);
        };

        requester.post('/photos/product/primary/multiple')
          .send(tooManyProductIds)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    after(async () => {
      await requester.close();
    });
});



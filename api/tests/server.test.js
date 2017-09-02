const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Llama} = require('./../models/llama');

const llamas = [
    {
        "name": "Effe", 
        "age": 2, 
        "_id": new ObjectID()
    }, 
    {
        "name": "Zip", 
        "age": 5, 
        "_id": new ObjectID()       
    }
]

beforeEach((done) => {
    Llama.remove({}).then(() => {
        return Llama.insertMany(llamas);
    }).then(() => done());
});

describe('GET /llama', () => {
    it('should get all llamas', (done) => {
        request(app)
        .get('/llamas')
        .expect(200)
        .expect((res) => {
            expect(res.body.llamas.length).toBe(2);
        })
        .end(done)
    })
})
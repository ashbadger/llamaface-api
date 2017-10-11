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

describe('POST /llama', () => {
    it('should create new llama', (done) => {
        var name = 'denp'
        var age = 8

        request(app)
        .post('/llamas')
        .send({name, age: 8})
        .expect(200)
        .expect((res) => {
            expect(res.body.name).toBe(name)
            expect(res.body.age).toBe(age)
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            Llama.findOne({name}).then((llama) => {
                expect(llama).toExist();
                done();
            })
        });
    })

    it('should not create a new llama without a name', (done) => {
        request(app)
        .post('/llamas')
        .send({age: 8})
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toContain('Path `name` is required.')
        })
        .end(done);
    });
})

describe('DELETE /llamas/:id', () => {
    it('should delete a llama', (done) => {
        var id = llamas[0]._id.toHexString()
        var num = llamas.length

        request(app)
        .delete(`/llamas/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.llama._id).toBe(id)
        })
        .end(done)
    });

    it('should return 404 if id not found', (done) => {
        var wrong_id = new ObjectID().toHexString();

        request(app)
        .delete(`/llamas/${wrong_id}`)
        .expect(404)
        .end(done)
    });

    it('should return 404 if invalid id', (done) => {
        var wrong_id = 'thisisnotright'

        request(app)
        .delete(`/llamas/${wrong_id}`)
        .expect(404)
        .end(done)
    });
})


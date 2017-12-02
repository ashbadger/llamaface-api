const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Llama } = require('../models/llamas');

const _ = require('lodash');
const jwt = require('jsonwebtoken')

effeId = new ObjectID()
zipId = new ObjectID()
hiloId = new ObjectID()

const llamas = [
    {
        name: "Effe", 
        email: "effe@llama.com",
        password: "thisisapassword",
        _id: effeId,
        tokens: [{
            access: "auth",
            token: jwt.sign({_id: effeId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    }, 
    {
        name: "Zip", 
        email: "zip@llama.com",
        password: "thisisapassword",
        _id: zipId
    },
    {
        name: "Hilo",
        email: "hilo@llama.com",
        password: "thisisapassword",
        _id: new ObjectID()
    }
]

beforeEach((done) => {
    Llama.remove({}).then(() => {
        var llamaOne = new Llama(llamas[0]).save();
        var llamaTwo = new Llama(llamas[1]).save();

        return Promise.all([llamaOne, llamaTwo])
    }).then(() => done())
});

describe('GET /llama', () => {
    it('should get all llamas', (done) => {
        request(app)
        .get('/llamas')
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toBe(2);
        })
        .end(done)
    })
})

describe('POST /llama', () => {
    it('should create new llama', (done) => {
        var name = 'Hilo'
        var email = 'hilo@llama.com'

        request(app)
        .post('/llamas')
        .send(llamas[2])
        .expect(200)
        .expect((res) => {
            expect(res.body.name).toBe(name)
            expect(res.body.email).toBe(email)
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

    it('should not create a new llama without a email', (done) => {
        let test_llama = _.omit(llamas[2], ['email'])

        request(app)
        .post('/llamas')
        .send(test_llama)
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toContain('Path `email` is required.')
        })
        .end(done);
    });

    it('should not create a new llama without a password', (done) => {
        let test_llama = _.omit(llamas[2], ['password'])

        request(app)
        .post('/llamas')
        .send(test_llama)
        .expect(400)
        .expect((res) => {
            expect(res.body.message).toContain('Path `password` is required.')
        })
        .end(done);
    });
})

describe('GET /llamas/:id', () => {
    it('should get a llama with specified id', (done) => {
        var id = llamas[0]._id.toHexString()

        request(app)
        .get(`/llamas/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(id)
        })
        .end(done)
    })
})

describe('DELETE /llamas/:id', () => {
    it('should delete a llama', (done) => {
        var id = llamas[0]._id.toHexString()
        var token = llamas[0].tokens[0].token
        var llama_count = llamas.length

        request(app)
        .delete(`/llamas/${id}`)
        .set('x-auth', token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(id)
        })
        .end((err, res) => {
            if (err) {
                return done();
            }

            Llama.findById(id).then((llama) => {
                expect(llama).toNotExist()
                done();
            }).catch((e) => done(e));
        })
    });

    it('should return 404 if id not found', (done) => {
        var wrong_id = new ObjectID().toHexString();
        var token = llamas[0].tokens[0].token

        request(app)
        .delete(`/llamas/${wrong_id}`)
        .set('x-auth', token)
        .expect(404)
        .end(done)
    });

    it('should return 404 if invalid id', (done) => {
        var wrong_id = 'thisisnotright'
        var token = llamas[0].tokens[0].token

        request(app)
        .delete(`/llamas/${wrong_id}`)
        .set('x-auth', token)
        .expect(404)
        .end(done)
    });
})

describe('GET /llamas/search', () => {
    it('should return search results', (done) => {
        var query = llamas[0].name

        request(app)
        .get(`/llamas/search`)
        .query({q: query})
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toBeGreaterThan(0)
            expect(res.body[0].name).toBe(query)
        })
        .end(done)
    })
})

describe('GET /llamas/me', () => {
    it('should return authenticated user', (done) => {
        var test_llama = llamas[0]
        var token = test_llama.tokens[0].token
        var id = test_llama._id.toHexString()

        request(app)
        .get(`/llamas/me`)
        .set('x-auth', token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(id)
        })
        .end(done)
    })
})

describe('POST /llamas/login', () => {
    it('should return auth token', (done) => {
        var test_llama = llamas[1]
        var id = test_llama._id.toHexString()

        request(app)
        .post(`/llamas/login`)
        .send(test_llama)
        .expect(200)
        .expect((res) => {
            expect(res.body.token).toExist()
        })
        .end(done)
    })
})

describe('DELETE /llamas/me/token', () => {
    it('should delete auth token', (done) => {
        var test_llama = llamas[0]
        var token = test_llama.tokens[0].token
        var id = test_llama._id.toHexString()

        request(app)
        .delete(`/llamas/me/token`)
        .set('x-auth', token)
        .send(test_llama.tokens[0])
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(id)
        })
        .end(done)
    })
})
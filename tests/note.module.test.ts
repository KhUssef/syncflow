import { Body, INestApplication } from '@nestjs/common';
import { test } from 'vitest';
import { describe } from 'vitest';
import { CreateCompanyWithManagerDto } from '../src/company/dto/create-company-with-manager.dto';
import { AuthModule } from 'src/auth/auth.module';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('Note Module Tests', () => {
    let app: INestApplication;
    let token: string;
    let noteId: number;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        const data: CreateCompanyWithManagerDto = {
            companyName: "Test Company",
            managerUsername: "lol",
            managerPassword: "kys"
        };
        const response = await request(app.getHttpServer()).post('/company/create-company')
            .set('Content-Type', 'application/json')
            .send(data);
        let code = response.body.code;
        const loginResponse = await request(app.getHttpServer()).post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                username: "lol",
                password: "kys",
                companyCode: code
            });
        token = loginResponse.body.access_token;
        console.log('Received token:', loginResponse.body);
    });

    test('create new note', async () => {
        const response = await request(app.getHttpServer()).post('/note')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Note',
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Note');
        expect(response.body.lineCount).toBe(50);
        noteId = response.body.id;
    });

    test('get all note ids', async () => {
        const response = await request(app.getHttpServer()).get('/note/allIds')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('get notes info', async () => {
        const response = await request(app.getHttpServer()).get('/note/info')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    test('get note lines', async () => {
        // create note first if not already done
        if (!noteId) {
            const createRes = await request(app.getHttpServer()).post('/note')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test Note 2' });
            noteId = createRes.body.id;
        }
        const response = await request(app.getHttpServer())
            .get(`/note/${noteId}/lines`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    test('bulk create lines', async () => {
        // create note first if not already done
        if (!noteId) {
            const createRes = await request(app.getHttpServer()).post('/note')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test Note 3' });
            noteId = createRes.body.id;
        }
        const response = await request(app.getHttpServer())
            .post(`/note/${noteId}/create-lines`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(201);
    });
});

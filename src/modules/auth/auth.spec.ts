import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DatabaseTestModule } from '../database/database-test.module';
import { AuthModule } from './auth.module';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserDTO } from '../user/user.dto';
import { UserModule } from '../user/user.module';
import { AuthExceptions } from './auth.exceptions';

describe('Autorização', () => {
  let userDTO: UserDTO;
  let userService: UserService;
  let userController: UserController;
  let app: INestApplication;

  beforeAll(async () => {
    /**
     * Inicializa módulo com base de dados em memória
     */
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseTestModule,
        UserModule,
        AuthModule
      ]
    }).compile();

    userDTO = new UserDTO({
      username: 'cesarsalesgomes',
      password: 'loremlorem',
      name: 'Cesar'
    });

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    /* Limpa base de dados antes de cada teste */
    await userService.deleteAll();
  });

  it('Cria usuário, realiza login, e verifica token retornado.', async () => {
    await userController.createUser(userDTO);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: userDTO.username, password: userDTO.password })
      .expect(201);

    expect(res.body.token).toBeDefined();
  });

  it('Realizar login sem usuário cadastrado, deve retornar erro 401 (Unauthorized).', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: userDTO.username, password: userDTO.password })
      .expect(401);

    expect(res.body.message).toEqual(AuthExceptions.INVALID_CREDENTIALS);
  });
});

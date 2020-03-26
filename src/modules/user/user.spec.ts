import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseTestModule } from '../database/database-test.module';
import { UserModule } from './user.module';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('Usuários', () => {
  let userDTO: UserDTO;
  let userService: UserService;
  let userController: UserController;

  beforeAll(async () => {
    /**
     * Inicializa módulo com base de dados em memória
     */
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseTestModule,
        UserModule
      ]
    }).compile();

    userDTO = new UserDTO({
      username: 'cesarsalesgomes',
      password: 'loremlorem',
      name: 'Cesar'
    });

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  beforeEach(async () => {
    /* Limpa base de dados antes de cada teste */
    await userService.deleteAll();
  });

  describe('Criação', () => {
    it('Usuário criado com sucesso.', async () => {
      await userController.createUser(userDTO);
      const username = await userService.getByUsername(userDTO.username);

      expect(username).toBeDefined();
    });

    it('Lança exceção caso usuário criado com nome de usuário existente na base.', async () => {
      await userController.createUser(userDTO);
      await expect(userController.createUser(userDTO)).rejects.toThrow();
    });
  });
});

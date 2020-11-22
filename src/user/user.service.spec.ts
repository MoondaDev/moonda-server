import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentQuery, Model } from 'mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockUser: (mock?: {
  _id?: string;
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  authType?: string;
  isExit?: boolean;
}) => Partial<User> = (mock?: {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  authType: string;
  isExit: boolean;
}) => {
  return {
    _id: (mock && mock._id) || 'a uuid',
    email: (mock && mock.email) || 'jongho.dev@gmail.com',
    password: (mock && mock.password) || 'password',
    name: (mock && mock.name) || 'Jeon Jongho',
    phone: (mock && mock.phone) || '010-7570-3529',
    authType: (mock && mock.authType) || 'email',
    isExit: (mock && mock.isExit) || false,
  };
};

const userArray = [mockUser(), mockUser({ name: 'ang' })];

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('users'),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('users'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // In all the spy methods/mock methods we need to make sure to
  // add in the property function exec and tell it what to return
  // this way all of our mongo functions can and will be called
  // properly allowing for us to successfully test them.
  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(userArray),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(userArray);
  });

  it('should getOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<User, User, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockUser({ _id: 'an id', email: 'test@gmail.com' }),
          ),
      }),
    );
    const findMockUser = mockUser({ _id: 'an id', email: 'test@gmail.com' });
    const foundUser = await service.findByEmail('test@gmail.com');
    expect(foundUser).toEqual(findMockUser);
  });

  it('should exists by email', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<User, User, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(
            mockUser({ _id: 'an id', email: 'test@gmail.com' }),
          ),
      }),
    );
    const foundUser = await service.existsByEmail('test@gmail.com');
    expect(foundUser).toEqual(true);

    // expect.
  });
});

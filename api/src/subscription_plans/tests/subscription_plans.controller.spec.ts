import { Test, TestingModule } from '@nestjs/testing';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription_plan.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription_plan.dto';
import { SubscriptionPlansController } from '../subscription_plans.controller';
import { SubscriptionPlansService } from '../subscription_plans.service';

describe('SubscriptionPlansController', () => {
  let controller: SubscriptionPlansController;
  let service: SubscriptionPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionPlansController],
      providers: [
        {
          provide: SubscriptionPlansService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionPlansController>(SubscriptionPlansController);
    service = module.get<SubscriptionPlansService>(SubscriptionPlansService);
  });

  describe('create', () => {
    it('should create a new subscription plan', async () => {
      const createDto: CreateSubscriptionPlanDto = {
        armSubscriptionPlanId: 1,
        armSubscriptionPlanName: 'Basic Plan',
        armSubscriptionPlanType: 'monthly',
        armSubscriptionPlanRole: 'user',
        armSubscriptionPlanAmount: 100,
        armSubscriptionPlanStatus: 1,
        armSubscriptionPlanPostId: 1,
        armSubscriptionPlanGiftStatus: 0,
        armSubscriptionPlanIsDelete: 0,
        armSubscriptionPlanCreatedDate: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(undefined);

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of subscription plans', async () => {
      const result = [{
        armSubscriptionPlanId: 1,
        armSubscriptionPlanName: 'Basic Plan',
        armSubscriptionPlanType: 'monthly',
        armSubscriptionPlanRole: 'user',
        armSubscriptionPlanAmount: 100,
        armSubscriptionPlanStatus: 1,
        armSubscriptionPlanPostId: 1,
        armSubscriptionPlanGiftStatus: 0,
        armSubscriptionPlanIsDelete: 0,
        armSubscriptionPlanCreatedDate: new Date(),
      }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  // describe('findOne', () => {
  //   it('should return a subscription plan by ID', async () => {
  //     const result = [{
  //       armSubscriptionPlanId: 1,
  //       armSubscriptionPlanName: 'Basic Plan',
  //       armSubscriptionPlanType: 'monthly',
  //       armSubscriptionPlanRole: 'user',
  //       armSubscriptionPlanAmount: 100,
  //       armSubscriptionPlanStatus: 1,
  //       armSubscriptionPlanPostId: 1,
  //       armSubscriptionPlanGiftStatus: 0,
  //       armSubscriptionPlanIsDelete: 0,
  //       armSubscriptionPlanCreatedDate: new Date(),
  //     }];

  //     jest.spyOn(service, 'findOne').mockResolvedValue(result);

  //     expect(await controller.findOne('1')).toBe(result);
  //   });
  // });

  describe('update', () => {
    it('should update a subscription plan', async () => {
      const updateDto: UpdateSubscriptionPlanDto = { armSubscriptionPlanName: 'Updated Plan' };

      jest.spyOn(service, 'update').mockResolvedValue('This action updates a #1 subscription number');

      expect(await controller.update('1', updateDto)).toBe('This action updates a #1 subscription number');
    });
  });

  describe('remove', () => {
    it('should remove a subscription plan', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue('This action removes a #1 subscriptionPlan');

      expect(await controller.remove('1')).toBe('This action removes a #1 subscriptionPlan');
    });
  });
});

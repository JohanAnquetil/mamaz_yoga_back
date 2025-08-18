import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlansService } from '../subscription_plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription_plan.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription_plan.dto';
import { unserialize } from 'php-unserialize';

describe('SubscriptionPlansService', () => {
  let service: SubscriptionPlansService;
  let repository: Repository<SubscriptionPlan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionPlansService,
        {
          provide: getRepositoryToken(SubscriptionPlan),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionPlansService>(SubscriptionPlansService);
    repository = module.get<Repository<SubscriptionPlan>>(getRepositoryToken(SubscriptionPlan));
  });

  describe('create', () => {
    it('should successfully create a subscription plan', async () => {
      const createDto = {
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
        armSubscriptionPlanOptions: 'a:1:{i:0;s:6:"option1";}',
      };

      // Simuler la réponse attendue
      jest.spyOn(repository, 'save').mockResolvedValue(createDto as any);

      await service.create(createDto);

      expect(repository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of subscription plans', async () => {
      const subscriptionPlans = [{
        armSubscriptionPlanId: 1,
        armSubscriptionPlanName: 'Basic Plan',
        armSubscriptionPlanType: 'monthly',
        armSubscriptionPlanRole: 'user',
      }];

      // Simuler la réponse attendue
      jest.spyOn(repository, 'find').mockResolvedValue(subscriptionPlans as any);

      const result = await service.findAll();
      expect(result).toEqual(subscriptionPlans);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should successfully update a subscription plan', async () => {
      // Simuler la réponse attendue pour `update`
      jest.spyOn(repository, 'update').mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);

      const updateDto: UpdateSubscriptionPlanDto = {
        armSubscriptionPlanName: 'Updated Plan',
      };

      await service.update(1, updateDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should successfully remove a subscription plan', async () => {
      // Simuler la réponse attendue pour `delete`
      jest.spyOn(repository, 'delete').mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});

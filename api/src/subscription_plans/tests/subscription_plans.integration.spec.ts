import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '@app/app.module';
import { SubscriptionPlan } from '../entities/subscription_plan.entity';
import { SubscriptionPlansService } from '../subscription_plans.service';

describe('SubscriptionPlansService (integration)', () => {
  let app: INestApplication;
  let subscriptionPlansService: SubscriptionPlansService;
  let subscriptionPlanRepository: Repository<SubscriptionPlan>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    subscriptionPlansService = moduleFixture.get<SubscriptionPlansService>(SubscriptionPlansService);
    subscriptionPlanRepository = moduleFixture.get<Repository<SubscriptionPlan>>(getRepositoryToken(SubscriptionPlan));
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new subscription plan', async () => {
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
    };

    await subscriptionPlansService.create(createDto);

    const subscriptionPlan = await subscriptionPlanRepository.findOne({
      where: { armSubscriptionPlanId: 1 },
    });

    expect(subscriptionPlan).toBeDefined();
    expect(subscriptionPlan?.armSubscriptionPlanName).toBe('Basic Plan');
  });

  it('should retrieve all subscription plans', async () => {
    const subscriptionPlans = await subscriptionPlansService.findAll();

    expect(Array.isArray(subscriptionPlans)).toBe(true);
    expect(subscriptionPlans.length).toBeGreaterThan(0);
  });

  it('should retrieve a single subscription plan by id', async () => {
    const plan = await subscriptionPlanRepository.findOne({
      where: { armSubscriptionPlanId: 1 },
    });

    const result = await subscriptionPlansService.findOne(plan?.armSubscriptionPlanId || 0);

    expect(result).toBeDefined();
    expect(result[0].armSubscriptionPlanId).toBe(plan?.armSubscriptionPlanId);
  });

  it('should update a subscription plan', async () => {
    const updateDto = {
      armSubscriptionPlanName: 'Updated Plan',
    };

    await subscriptionPlansService.update(1, updateDto);

    const updatedPlan = await subscriptionPlanRepository.findOne({
      where: { armSubscriptionPlanId: 1 },
    });

    expect(updatedPlan?.armSubscriptionPlanName).toBe('Updated Plan');
  });

  it('should delete a subscription plan', async () => {
    await subscriptionPlansService.remove(1);

    const deletedPlan = await subscriptionPlanRepository.findOne({
      where: { armSubscriptionPlanId: 1 },
    });

    expect(deletedPlan).toBeNull();
  });
});

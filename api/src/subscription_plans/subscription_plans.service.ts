import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubscriptionPlanDto } from "./dto/create-subscription_plan.dto";
import { UpdateSubscriptionPlanDto } from "./dto/update-subscription_plan.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SubscriptionPlan } from "./entities/subscription_plan.entity";
import { Repository } from "typeorm";
import { unserialize } from "php-unserialize";

@Injectable()
export class SubscriptionPlansService {
  private allSubscriptionsPlansIds: any[] = [];

  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<void> {
    await this.subscriptionPlanRepository.save(createSubscriptionPlanDto);
  }

  async findAll() {
    try {
      const allSubscriptionsPlan = await this.subscriptionPlanRepository.find();
      const parsedAllSubscriptionPlans: any = [];
      this.allSubscriptionsPlansIds = [];

      allSubscriptionsPlan.map((SubscriptionPlan) => {
        parsedAllSubscriptionPlans.push({
          armSubscriptionPlanId: SubscriptionPlan.armSubscriptionPlanId,
          armSubscriptionPlanName: SubscriptionPlan.armSubscriptionPlanName,
          armSubscriptionPlanType: SubscriptionPlan.armSubscriptionPlanType,
          armSubscriptionPlanRole: SubscriptionPlan.armSubscriptionPlanRole,
        });
        this.allSubscriptionsPlansIds.push(
          SubscriptionPlan.armSubscriptionPlanId,
        );
      });
      return parsedAllSubscriptionPlans;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async loadIdsSubscriptionPlans(name: string) {
    const allSubscriptionsPlan = await this.subscriptionPlanRepository.find();
    const parsedAllSubscriptionPlans: any = [];
    this.allSubscriptionsPlansIds = [];

    allSubscriptionsPlan.map((SubscriptionPlan) => {
      this.allSubscriptionsPlansIds.push(
        `${name}${SubscriptionPlan.armSubscriptionPlanId}`,
      );
    });
    return this.allSubscriptionsPlansIds;
  }

  async findOne(id: number): Promise<any> {
    const subscriptionPlanFindOne: any =
      await this.subscriptionPlanRepository.findOne({
        where: { armSubscriptionPlanId: id },
      });

    if (!subscriptionPlanFindOne) {
      throw new NotFoundException(
        `Le plan de subscription avec l'id: ${id} n'existe pas`,
      );
    }

    const parsedSubscriptionPlan = [];
    parsedSubscriptionPlan.push({
      armSubscriptionPlanId: subscriptionPlanFindOne.armSubscriptionPlanId,
      armSubscriptionPlanName: subscriptionPlanFindOne.armSubscriptionPlanName,
      armSubscriptionPlanDescription:
        subscriptionPlanFindOne.armSubscriptionPlanDescription,
      armSubscriptionPlanType: subscriptionPlanFindOne.armSubscriptionPlanType,
      armSubscriptionPlanOptions: unserialize(
        subscriptionPlanFindOne.armSubscriptionPlanOptions,
      ),
      armSubscriptionPlanAmount:
        subscriptionPlanFindOne.armSubscriptionPlanAmount,
      armSubscriptionPlanStatus:
        subscriptionPlanFindOne.armSubscriptionPlanStatus,
      armSubscriptionPlanRole: subscriptionPlanFindOne.armSubscriptionPlanRole,
      armSubscriptionPlanPostId:
        subscriptionPlanFindOne.armSubscriptionPlanPostId,
      armSubscriptionPlanGiftStatus:
        subscriptionPlanFindOne.armSubscriptionPlanGiftStatus,
      armSubscriptionPlanIsDelete:
        subscriptionPlanFindOne.armSubscriptionPlanIsDelete,
      armSubscriptionPlanCreatedDate:
        subscriptionPlanFindOne.armSubscriptionPlanCreatedDate,
    });
    return parsedSubscriptionPlan;
  }

  async update(
    id: number,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<string> {
    await this.subscriptionPlanRepository.update(id, updateSubscriptionPlanDto);
    return `This action updates a #${id} subscription number`;
  }

  async remove(id: number): Promise<string> {
    await this.subscriptionPlanRepository.delete(id);
    return `This action removes a #${id} subscriptionPlan`;
  }
}

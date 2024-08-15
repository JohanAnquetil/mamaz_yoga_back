import { SubscriptionPlansService } from "@app/subscription_plans/subscription_plans.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { unserialize } from "php-unserialize";
import { Repository } from "typeorm";
import { dateConversionUnixToIso } from "./date_conversion";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserDto } from "./dto/update_user.dto";
import { User } from "./entities/user.entity";
import { isExpiredSubscription } from "./is_expired_subscription";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<Record<string, any> | string> {
    const queryAllUsers: any[] = await this.userRepository.find();

    let users: any = [];
    if (queryAllUsers) {
      queryAllUsers.map((user: any) => {
        users.push({
          id: user.id,
          user_login: user.userLogin,
          user_email: user.userEmail,
          user_pass: user.userPass,
          user_status: user.userStatus,
          user_registered: user.userRegistered,
        });
      });
      return {
        message: "Des utilisateurs ont été trouvés",
        data: users,
      };
    } else {
      return "Aucun utilisateur a été trouvé";
    }
  }

  async findOneByLogin(login: string) {
    return this.userRepository.findOne({
      where: {
        userLogin: login,
      },
    });
  }

  async findOne(id: number): Promise<any> {
    let member = await this.userRepository
      .createQueryBuilder("user")
      .where("id = :memberId", { memberId: id })
      .leftJoinAndSelect("user.usersMetas", "userMeta")
      .getOne();
    if (!member) {
      throw new NotFoundException(
        `L'utilisateur avec l'id: ${id} n'existe pas`,
      );
    }
    const allSubscriptionsPlansIds =
      await this.subscriptionPlansService.loadIdsSubscriptionPlans(
        "arm_user_plan_",
      );
    console.log(
      `allSubscriptionsPlansIds in user service; ${allSubscriptionsPlansIds}`,
    );

    let memberAccountData: Record<string, any> = {
      message: "Données du client trouvées",
      data: {
        genre: "",
        email: member.userEmail,
        login: member.userLogin,
        prenom: "",
        password: member.userPass,
        has_active_premium_subscription: false,
        nom: "",
        surnom: "",
        nom_a_afficher: member.displayName,
        description: "",
        capacite: "",
        expiration_plan: "",
        capacité: "",
        plan_actuel: "",
        options_du_plan: "",
        user_status: member.userStatus,
      },
    };
    try {
      member.usersMetas.map((usersMeta: any) => {
        if (usersMeta.metaKey === "gender") {
          memberAccountData.data["genre"] = usersMeta.metaValue;
        }

        if (usersMeta.metaKey === "first_name") {
          memberAccountData.data["prenom"] = usersMeta.metaValue;
        }

        if (usersMeta.metaKey === "last_name") {
          memberAccountData.data["nom"] = usersMeta.metaValue;
        }

        if (usersMeta.metaKey === "nickname") {
          memberAccountData.data["surnom"] = usersMeta.metaValue;
        }

        if (usersMeta.metaKey === "description") {
          memberAccountData.data["description"] = usersMeta.metaValue;
        }

        if (usersMeta.metaKey === "mod350_capabilities") {
          memberAccountData.data["capacite"] = unserialize(usersMeta.metaValue);
        }

        if (usersMeta.metaKey === "arm_changed_expiry_date_plans") {
          memberAccountData.data["expiration_plan"] = unserialize(
            usersMeta.metaValue,
          );
        }

        if (
          allSubscriptionsPlansIds.some((input) => input == usersMeta.metaKey)
        ) {
          const detailsCurrentPlan = unserialize(usersMeta.metaValue);
          memberAccountData.data["plan_actuel"] = detailsCurrentPlan;
          const armStartPlan = dateConversionUnixToIso(
            detailsCurrentPlan.arm_start_plan,
          );
          const armEndPlan = dateConversionUnixToIso(
            detailsCurrentPlan.arm_expire_plan,
          );
          memberAccountData.data["plan_actuel"]["arm_start_plan"] =
            armStartPlan;
          memberAccountData.data["plan_actuel"]["arm_expire_plan"] = armEndPlan;
          memberAccountData.data["has_active_premium_subscription"] =
            isExpiredSubscription(armEndPlan) as boolean;
          if (
            detailsCurrentPlan.arm_current_plan_detail
              .arm_subscription_plan_options
          ) {
            try {
              memberAccountData.data["options_du_plan"] = unserialize(
                detailsCurrentPlan.arm_current_plan_detail
                  .arm_subscription_plan_options,
              );
              delete memberAccountData.data.plan_actuel
                .arm_subscription_plan_options;
            } catch (e) {
              console.log(`Error unserialisation php plan option ${e}`);
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }

    return memberAccountData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<string> {
    await this.userRepository.update(id, updateUserDto);
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}

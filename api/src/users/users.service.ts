import { SubscriptionPlansService } from "@app/subscription_plans/subscription_plans.service";
import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { unserialize } from "php-unserialize";
import { In, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create_user.dto";
import { UpdateUserDto } from "./dto/update_user.dto";
import { User } from "./entities/user.entity";
import { isExpiredSubscription } from "./utils/is_expired_subscription";
import { dateConversionUnixToIso } from "./utils/date_conversion";
import { TagsPreferencesUser } from "./entities/tags_preferences.entity";
import { PreferencesUserDTO } from "./dto/preferences_user.dto";
import { VideosUserTags } from "./entities/tags";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly subscriptionPlansService: SubscriptionPlansService,
    @InjectRepository(TagsPreferencesUser)
    private readonly tagPreferenceUserRepository : Repository<TagsPreferencesUser>,
    @InjectRepository(VideosUserTags)
    private readonly videosUserTagsRepository: Repository<VideosUserTags>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.userRepository.save(createUserDto);
  }

  async getTagsPreferences() {
    const tagsPreferences = await this.tagPreferenceUserRepository.find();
    if (!tagsPreferences || tagsPreferences.length === 0) {
      throw new NotFoundException("Aucune préférence de tags trouvée");
    }
    return tagsPreferences;
  }

  async updateTagsPreferences(preferencesUser: PreferencesUserDTO) {
  const { user_id, tags_id } = preferencesUser;

  // Vérifie que l'utilisateur existe
  const user = await this.userRepository.findOne({ where: { id: user_id } });
  if (!user) {
    throw new NotFoundException(`L'utilisateur avec l'id ${user_id} n'existe pas`);
  }

  // Vérifie que tous les tags existent
  const existingTags = await this.videosUserTagsRepository.findBy({ id: In(tags_id) });
  if (existingTags.length !== tags_id.length) {
    throw new NotFoundException(`Certains tags n'existent pas : ${tags_id}`);
  }

  // Supprimer toutes les préférences existantes de l'utilisateur
  await this.tagPreferenceUserRepository.delete({ user_id });

  // Créer les nouvelles préférences
  const newPreferences = tags_id.map(tag_id =>
    this.tagPreferenceUserRepository.create({ user_id, tags_id: tag_id })
  );
  await this.tagPreferenceUserRepository.save(newPreferences);

  return "Préférences de tags mises à jour avec succès";
}

  async findAll(): Promise<Record<string, any> | string> {
    const queryAllUsers: User[] = await this.userRepository.find();

    let users: Record<string, any>[] = [];

    if (queryAllUsers.length === 0) {
      return "Aucun utilisateur a été trouvé";
  }

    if (queryAllUsers) {
      queryAllUsers.map((user) => {
        users.push({
          displayName: user.userNicename,
          id: user.id,
          userLogin: user.userLogin,
          userNicename: "Elsa",
          userEmail: user.userEmail,
          userPass: user.userPass,
          userStatus: user.userStatus,
          userRegistered: user.userRegistered,
          usersMetas: user.usersMetas
        });
      });
      return {
        message: "Des utilisateurs ont été trouvés",
        data: users,
      };
    } else {
      throw HttpException;
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
          try {
          // Assign detailsCurrentPlan from unserialized metaValue
         const emojiRegex = /([\u231A-\uD83E\uDDFF])/gu;
          const emojis = usersMeta.metaValue.match(emojiRegex);
         
          const cleanedMetaValue = usersMeta.metaValue.replace(emojiRegex, "    ");
         const detailsCurrentPlan = unserialize(cleanedMetaValue);

          memberAccountData.data["plan_actuel"] = detailsCurrentPlan;
          
          const armStartPlan = dateConversionUnixToIso(
            detailsCurrentPlan.arm_start_plan,
          );
          const armEndPlan = dateConversionUnixToIso(
            detailsCurrentPlan.arm_expire_plan,
          );

          const armStartTrial = dateConversionUnixToIso(
            detailsCurrentPlan.arm_trial_start,
          );
          const armEndTrial = dateConversionUnixToIso(
            detailsCurrentPlan.arm_trial_end,
          );
          
          const today = new Date().toISOString()
          memberAccountData.data["plan_actuel"]["arm_start_plan"] =
            (armStartTrial == undefined || armStartTrial == null || armStartPlan < today ) ? armStartPlan : armStartTrial;
          memberAccountData.data["plan_actuel"]["arm_expire_plan"] = 
            (armEndTrial == undefined || armEndTrial == null || armStartPlan < today) ? armEndPlan : armEndTrial;


          // console.log(detailsCurrentPlan.arm_trial_end);
          // console.log(isExpiredSubscription(armEndPlan));
          // console.log(detailsCurrentPlan.arm_trial_end);
          // console.log(isExpiredSubscription(detailsCurrentPlan.arm_trial_end));
          // const premiumStatus = isExpiredSubscription(armEndPlan);
          //   memberAccountData.data["has_active_premium_subscription"] =
          //     typeof premiumStatus === "boolean"
          //       ? premiumStatus
          //       : !!isExpiredSubscription(detailsCurrentPlan.arm_trial_end);
          
          memberAccountData.data["has_active_premium_subscription"] =
            isExpiredSubscription(armEndPlan) as boolean || isExpiredSubscription(dateConversionUnixToIso(detailsCurrentPlan.arm_trial_end));
          if (
            detailsCurrentPlan?.arm_current_plan_detail
              .arm_subscription_plan_options
          ) {
            try {
              memberAccountData.data["options_du_plan"] = unserialize(
                detailsCurrentPlan?.arm_current_plan_detail
                  .arm_subscription_plan_options,
              );
              delete memberAccountData.data.plan_actuel
                .arm_subscription_plan_options;
            } catch (e) {
              console.log(`Error unserialisation php plan option ${e}`);
            }
          }
        } catch (e) {
          console.log(`Error processing plan data: ${e}`);
        }
      }
    })
    } catch (e) {
      console.log(`Error processing user metas: ${e}`);
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

  async getUserTagsPreferences(id: number) {
  const tagsPreferences = await this.tagPreferenceUserRepository.createQueryBuilder("tagsPreferences")
    .where("tagsPreferences.user_id = :userId", { userId: id })
    .getMany();
  if (!tagsPreferences || tagsPreferences.length === 0) {
    throw new NotFoundException(`No tags preferences found for user with id ${id}`);
  }
  console.log("tagsPreferences", tagsPreferences);
  return tagsPreferences;
}
}
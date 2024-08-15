// const express = require('express');
// const { createUser, loginUser } = require('../services/logging_user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const private = require ('../src/auth/private_key')
// const User = require('../src/models/users');
// const bodyParser = require('body-parser');
// const private_key = require('../src/auth/private_key');
// const { fetchUniqueSubscriptionNames } = require('../src/models/subcription_plans');
// const UserMeta = require('../src/models/users_meta');
// //var phpUnserialize = require('php-unserialize');
// import { phpUnserialize } from 'php-unserialize';
// const router = express.Router();

//     router.get('/', async (req, res) => {
//         let mod350_capabilities = null;
//         let planMeta = null;
//         let expirationDate = ''
//         let subcriptionPlanStatus = 0
//         if (!req.body.username) {
//             return res.status(400).json({ message: "Le nom d'utilisateur est requis." });
//         }
//         try {
//             const user = await User.findOne({ where: { user_login: req.body.username },
//                 include: [{
//                     model: UserMeta,
//                     as: 'UserMeta',
//                 }]
//             }
//             );
//             if (!user) {
//                 const message = "Erreur de login ou de mot de passe";
//                 return res.status(404).json({ message });
//             }

//             const subscriptionNames = await fetchUniqueSubscriptionNames();
//                 for (let i = 0 ; i < user.UserMeta.length ; i++) {
//                     const metaKey = user.UserMeta[i].meta_key.trim();
//                 if (subscriptionNames.includes(metaKey)) {
//                     planMeta = user.UserMeta[i];
//                         break;
//                 }

//                 if (metaKey == 'mod350_capabilities') {
//                     mod350_capabilities = phpUnserialize.unserialize(user.UserMeta[i].meta_value)

//                         if (mod350_capabilities.metaKey == "armember_access_plan_20") {
//                             console.log("t'es sur le bon chemin mon gars")
//                         }
//                 }
//                     }

//                     if (planMeta && planMeta.dataValues && planMeta.dataValues.meta_value) {

//                 try {
//                     var subscriptionCurrentPlanDetails = phpUnserialize.unserialize(planMeta.dataValues.meta_value).arm_current_plan_detail
//                     var subcriptionPlanName = subscriptionCurrentPlanDetails.arm_subscription_plan_name
//                     var subscriptionDetailsPlan = phpUnserialize.unserialize(subscriptionCurrentPlanDetails.arm_subscription_plan_options)}
//                     catch (error) { console.error(error)}
//                     var subscriptionPlanDescription = subscriptionCurrentPlanDetails.arm_subscription_plan_description
//                     subcriptionPlanStatus = subscriptionCurrentPlanDetails.arm_subscription_plan_status
//                     var subscriptionPlanCreatedDate = subscriptionCurrentPlanDetails.arm_subscription_plan_created_date;
//                     var subscriptionPlanCreatedDateIso = new Date(subscriptionPlanCreatedDate.replace(' ', 'T') + 'Z').toISOString();
//                     var subscriptionPlanCreatedDatePlanId = subscriptionCurrentPlanDetails.arm_subscription_plan_id
//                     var subscriptionPlanType = subscriptionCurrentPlanDetails.arm_subscription_plan_type
//                     var subscriptionPlanAmount = subscriptionCurrentPlanDetails.arm_subscription_plan_amount
//                     var subscriptionPlanRole = subscriptionCurrentPlanDetails.arm_subscription_plan_role
//                     var subscriptionPlanPostId = subscriptionCurrentPlanDetails.arm_subscription_plan_post_id
//                     var subscriptionPlanGiftStatus = subscriptionCurrentPlanDetails.arm_subscription_plan_gift_status
//                     var subcriptionPlanIsDelete = subscriptionCurrentPlanDetails.arm_subscription_plan_is_delete
//                     var userSelectedPaymentCycle = subscriptionCurrentPlanDetails.arm_user_selected_payment_cycle

//                     var expirePlan = phpUnserialize.unserialize(planMeta.dataValues.meta_value).arm_expire_plan
//                     const date = new Date(expirePlan * 1000);
//                     expirationDate = date.toISOString()
//             }
//             const message = "L'utilisateur a été trouvé"
//             return res.json({message, data: {id: user.ID, username: user.user_login,
//                 email: user.user_email, nicename: user.user_nicename,
//                 name: user.display_name,
//                 user_subscription_details:
//                 {
//                     arm_subscription_plan_id: subscriptionPlanCreatedDatePlanId,
//                     susbscription_plan_name: subcriptionPlanName,
//                     arm_subscription_plan_description: subscriptionPlanDescription,
//                     expiration_plan: expirationDate,
//                     arm_subscription_plan_type: subscriptionPlanType,
//                     arm_subscription_plan_status: subcriptionPlanStatus,
//                     arm_subscription_plan_created_date: subscriptionPlanCreatedDateIso,
//                     arm_subscription_plan_options: subscriptionDetailsPlan,
//                     arm_subscription_plan_amount: subscriptionPlanAmount,
//                     arm_subscription_plan_role: subscriptionPlanRole,
//                     arm_subscription_plan_post_id: subscriptionPlanPostId,
//                     arm_subscription_plan_gift_status: subscriptionPlanGiftStatus,
//                     arm_subscription_plan_is_delete: subcriptionPlanIsDelete,
//                     arm_user_selected_payment_cycle: userSelectedPaymentCycle,
//                 },
//                 arm_mod350_capabilities: mod350_capabilities,
//                  user_meta: UserMeta
//                 },
//                  token})

//             return res.status(401).json({ message: "Erreur de login ou de mot de passe." });
//         }
//             catch (error) {
//                 console.error("Erreur interne :", error);
//             res.status(500).json({ message: "Une erreur interne est survenue" });
//         }
//     });
//     module.exports = router;

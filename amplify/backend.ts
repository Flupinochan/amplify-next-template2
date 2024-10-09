import * as iam from 'aws-cdk-lib/aws-iam';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { chatOpenAI } from './functions/chatOpenAI/resource';

const backend = defineBackend({
  auth,
  data,
  chatOpenAI,
});

const chatOpenAIFunction = backend.chatOpenAI.resources.lambda;
const chatOpenAIStatement = new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: ['appsync:*', 'dynamodb:*', 'secretsmanager:*', 'bedrock:*'],
  resources: ['*'],
});
chatOpenAIFunction.addToRolePolicy(chatOpenAIStatement);
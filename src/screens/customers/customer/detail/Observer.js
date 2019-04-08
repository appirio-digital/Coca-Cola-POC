import RuleEngine from 'node-rules';
import JSONfn from 'json-fn';

import validationRules from './rules.json';

import { find, findIndex, get, isEmpty, isArray, split } from 'lodash';
import {
  fetchBusinessRule,
  fetchConfigurationRule,
  TriggerWhen,
  TriggerType
} from '../../../../services/omcClient';
import DBLayer from '../../../../services/DBLayer';

const handlers = [];
export const Click = () => {
  // handlers = []; // observers
};

Click.prototype = {
  subscribe: function(name, fn) {
    handlers.push({ name: name, function: fn });
  },

  unsubscribe: function(name) {
    handlers = handlers.filter(item => {
      return item.name !== name;
    });
  },

  fire: function(name, o, thisObj) {
    var scope = thisObj || window;
    const handler = find(handlers, handler => {
      return handler.name == name;
    });
    if (handler) handler.function.call(scope, o);
  }
};

export const validateObject = async object => {
  try {
    const configurationRulesJSONs = await fetchConfigurationRule();
    // console.log(JSONfn.stringify(configurationRulesJSONs));
    const rulesNew = JSONfn.parse(JSONfn.stringify(configurationRulesJSONs));

    const isUpdate = object.data && object.data.id ? true : false;
    const isDelete =
      object.TriggerType && object.TriggerType == TriggerType.onDelete
        ? true
        : false;
    const isRead =
      object.TriggerType && object.TriggerType == TriggerType.onRead
        ? true
        : false;
    const afterRules = rulesNew.filter(
      item =>
        item.object == object.object &&
        item.when == TriggerWhen.after &&
        (isRead
          ? item.trigger == TriggerType.onRead
          : isDelete
            ? item.trigger == TriggerType.onDelete
            : !isUpdate && !isDelete
              ? item.trigger == TriggerType.onCreate
              : item.trigger == TriggerType.onUpdate)
    );
    const beforeRules = rulesNew.filter(
      item =>
        item.object == object.object &&
        item.when == TriggerWhen.before &&
        (isRead
          ? item.trigger == TriggerType.onRead
          : isDelete
            ? item.trigger == TriggerType.onDelete
            : !isUpdate && !isDelete
              ? item.trigger == TriggerType.onCreate
              : item.trigger == TriggerType.onUpdate)
    );

    try {
      let index = -1;
      if (!isEmpty(beforeRules)) {
        const result = await executeRules(object.data, beforeRules);
        index = findIndex(result, values => !values.result);
        if (index != -1) {
          console.log(beforeRules);
          object.onFailHandler(
            result[index].reason
              ? result[index].reason
              : 'Configuration rule not passed'
          );
          return;
        }
      }

      await object.onSuccessHandler(object.data);

      if (!isEmpty(afterRules)) {
        const resultAfter = await executeRules(object.data, afterRules);
        const index = findIndex(resultAfter, values => !values.result);
        if (index != -1) {
          object.onFailHandler(
            result[index].reason
              ? result[index].reason
              : 'Configuration rule not passed'
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const deStructureFacts = (facts, data) => {
  const factList = [];

  try {
    const index = findIndex(facts, fact =>
      isArray(data[split(fact, '.', 1)[0]])
    );
    if (index == -1) {
      let fact = {};
      facts.map(key => {
        fact[key] = get(data, key);
      });
      factList.push(fact);
    } else {
      data[split(facts[index], '.', 1)[0]].map((value, index) => {
        let fact = {};
        facts.map(key => {
          let newKey = split(key, '.', 1)[0];
          isArray(data[newKey])
            ? (fact[newKey] = get(data, newKey + '[' + index + ']'))
            : (fact[newKey] = get(data, newKey));
        });
        factList.push(fact);
      });
    }
  } catch (error) {
    console.log(error);
  }

  return factList;
};

export const executeRules = (data, rules) => {
  var R = new RuleEngine();
  const promisses = [];
  rules.map(rules => {
    try {
      deStructureFacts(rules.fact, data).map(fact => {
        R.register(rules.rule);
        promisses.push(
          new Promise((resolve, reject) => {
            R.execute(fact, function(response) {
              resolve(response);
            });
          })
        );
      });
    } catch (error) {
      console.log(error);
    }
  });

  return Promise.all(promisses);
};

export const executeBusinessRulesAndPerformCRUDOperation = async payload => {
  try {
    //First execute triggers which needs to be fired before CRUD operatiton.
    await findAndExecuteBusinessRules(
      payload.object,
      payload.triggerType,
      TriggerWhen.before,
      payload.data
    );

    //Now perform the CRUD operation.
    const crudResponse = await payload.crudOperation();

    //First execute triggers which needs to be fired before CRUD operatiton.
    await findAndExecuteBusinessRules(
      payload.object,
      payload.triggerType,
      TriggerWhen.after,
      payload.data
    );

    //All triggers executed successfully. Now call the successHandler
    payload.onSuccessHandler(crudResponse);
  } catch (error) {
    payload.onFailHandler(error);
  }
};

const findAndExecuteBusinessRules = async (
  endPoint,
  triggerType,
  triggerWhen,
  jsonPayload
) => {
  try {
    const businessRulesJSONs = await fetchBusinessRule(
      endPoint,
      triggerType,
      triggerWhen
    );
    console.log('businessRulesJSONs', businessRulesJSONs.length);
    if (businessRulesJSONs.length == 0) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      //Iterate through all business rules and execute them.
      for (let index = 0; index < businessRulesJSONs.length; index++) {
        const businessRuleJSON = businessRulesJSONs[index];
        try {
          const promise = await executeBusinessRule(
            businessRuleJSON,
            jsonPayload
          );
          if (index + 1 === businessRulesJSONs.length) {
            resolve();
          }
        } catch (error) {
          reject(error);
          break;
        }
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const executeBusinessRule = async (businessRuleJSON, jsonPayload) => {
  try {
    //Prepare the parameters for the rules engine to be sent.
    return new Promise(async (resolve, reject) => {
      const parameters = businessRuleJSON.arguments;
      var payload = {};
      parameters.forEach(element => {
        payload = { ...payload, [element]: jsonPayload[element] };
      });
      const attachmentFunction = businessRuleJSON.attachment.bind(this);
      try {
        const response = await attachmentFunction(DBLayer, payload);
        if (
          response !== businessRuleJSON.output.success &&
          businessRuleJSON.output.continueOnError === 'FALSE'
        ) {
          console.log('BUSINESS RULE FAILED');
          reject(businessRuleJSON.output.error.message);
        } else {
          console.log('BUSINESS RULE PASSED');
          resolve(response);
        }
      } catch (error) {
        console.log('BUSINESS RULE FAILED');
        //reject(error);
        businessRuleJSON.output.continueOnError == 'TRUE'
          ? resolve()
          : reject(error);
      }
    });
  } catch (error) {
    return businessRuleJSON.output.continueOnError == 'TRUE'
      ? Promise.resolve()
      : Promise.reject(error.message);
  }
};

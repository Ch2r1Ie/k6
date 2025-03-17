import { check } from "k6";
import { scenario } from "k6/execution";
import http from "k6/http";

const HOST = "";
const Ids = ["67ba7166-9c31-402e-a876-5ab8d74a507320241028124950"];

export const serviceName = "";

export function callAPI() {
  const iteration = scenario.iterationInTest;
  const threadNum = __ENV.THREAD_NUM;
  let url = `${HOST}`;
  let body = JSON.stringify({
    campaignId: campaignIds[threadNum - 1],
    citizenId: `loadtest-${iteration}`,
    channelReferenceId: ``,
  });
  let params = {
    headers: {
      "api-key": "",
      "api-secret": "",
      "Content-Type": "application/json",
      Authorization: `Bearer loadtest-${iteration}`,
    },
  };

  const response = http.post(url, body, params);
  check(response, { "status is 200": (r) => r.status === 200 });
}

export async function setRedisData() {}
export async function clearRedisData() {}

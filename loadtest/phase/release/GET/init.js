import http from "k6/http";
import { check, sleep } from "k6";
import { scenario } from 'k6/execution';
import { SharedArray } from 'k6/data';

export const HOST = "";
export const API = "";

const campaignIds = [
  "67ba7166-9c31-402e-a876-5ab8d74a507320241028124950",
  "ed173c51-9bba-499e-be2d-5d321a02efb520241028125100",
  "22d0c25d-a093-4624-bcb5-02446300fc7020241028125146",
  "6338070d-39fd-487b-a349-ffbf5035762d20241028125225",
  "79e9400f-b8ec-48ab-8de7-c0546c0ae02920241028125301",
  "9a92a9d8-26dc-4434-87fe-b520e2162e7420241028125339"
]

export const serviceName = "";
export function callAPI() {

  const iteration = scenario.iterationInTest;

  const url = `${HOST + API}/${campaignIds[iteration % 6]}?couponOrder=${0}`;

  const HEADER = {
    Authorization: `Bearer loadtest-${(iteration + 1) % 10000}`,
  };
  
  const response = http.get(url, {
    headers: HEADER
  });
  check(response, { "status is 200": (r) => r.status === 200 });
}

export async function setRedisData() {
  // await redis.setRedisData();
}

export async function clearRedisData() {
  // await redis.clearRedisData();
}

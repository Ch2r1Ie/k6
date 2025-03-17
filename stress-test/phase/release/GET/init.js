import http from "k6/http";
import { check } from "k6";
import { scenario } from "k6/execution";

export const HOST = "";
export const API = "";

const Ids = [""];

export const serviceName = "";
export function callAPI() {
  const iteration = scenario.iterationInTest;

  const url = `${HOST + API}/${Ids[iteration % 6]}`;

  const HEADER = {
    Authorization: `Bearer loadtest-${iteration}`,
  };

  const response = http.get(url, {
    headers: HEADER,
  });
  check(response, { "status is 200": (r) => r.status === 200 });
}

export async function setRedisData() {}

export async function clearRedisData() {}

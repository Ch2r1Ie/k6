import { check } from "k6";
import { SharedArray } from 'k6/data';
import { scenario } from 'k6/execution';
import http from "k6/http";

const HOST = "";
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
    const iteration = scenario.iterationInTest 
    const threadNum = __ENV.THREAD_NUM
    let url = `${HOST}/api/v1/`
    let body = JSON.stringify({
        campaignId: campaignIds[threadNum - 1],
        citizenId: `loadtest-${iteration}`,
        channelReferenceId: `channel_ref_loadtest_${iteration}_t${threadNum}`,
    })
    let params = {
        headers: {
            "api-key": "BtqkfVvE0Z",
            "api-secret": "Pgv2lSWpP4ok9yOgUPir4MXwXQvZdIlK",
            "Content-Type": "application/json",
            Authorization: `Bearer loadtest-${iteration}`,
        }
    }

    const response = http.post(url, body, params)
    check(response, { "status is 200": (r) => r.status === 200 })
}

export async function setRedisData() {}
export async function clearRedisData() {}
  
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

import {
  callAPI,
  serviceName,
  setRedisData,
  clearRedisData,
} from "./phase12/nov-release/POST/init.js";

const executor = "constant-vus";

export const options = {
  scenarios: {
    THREAD_1: {
      executor: executor,
      vus: 1,
      duration: "5m",
      env: { THREAD_NUM: "1" },
    },
    THREAD_2: {
      executor: executor,
      vus: 2,
      duration: "5m",
      env: { THREAD_NUM: "2" },
      startTime: "7m",
    },
    THREAD_3: {
      executor: executor,
      vus: 3,
      duration: "5m",
      env: { THREAD_NUM: "3" },
      startTime: "14m",
    },
    THREAD_4: {
      executor: executor,
      vus: 4,
      duration: "5m",
      env: { THREAD_NUM: "4" },
      startTime: "21m",
    },
    THREAD_5: {
      executor: executor,
      vus: 5,
      duration: "5m",
      env: { THREAD_NUM: "5" },
      startTime: "28m",
    },
    THREAD_6: {
      executor: executor,
      vus: 6,
      duration: "5m",
      env: { THREAD_NUM: "6" },
      startTime: "35m",
    },
  },
  thresholds: {},
};

for (let key in options.scenarios) {
  let threshold1 = `iteration_duration{scenario:${key}}`;
  options.thresholds[threshold1] = [];
  options.thresholds[threshold1].push("max>=0");

  let threshold2 = `iterations{scenario:${key}}`;
  options.thresholds[threshold2] = [];
  options.thresholds[threshold2].push("count>=0");

  let threshold3 = `http_req_failed{scenario:${key}}`;
  options.thresholds[threshold3] = [];
  options.thresholds[threshold3].push("rate>=0");
}

export async function setup() {
  console.log("Setting up test...");

  setRedisData();
}

export default function () {
  callAPI();
}

export async function teardown(data) {
  console.log("Performing teardown...");

  clearRedisData();
}

export function handleSummary(data) {
  const currentDate = new Date();
  for (let i = 1; i <= 6; i++) {
    let keyIterations = `iterations{scenario:THREAD_${i}}`;
    let keyIterationDuration = `iteration_duration{scenario:THREAD_${i}}`;
    let newKey = `THREAD_${i}`;
    data.metrics[newKey] = {
      type: "trend",
      contains: "time",
      values: {
        count: data.metrics[keyIterations]["values"]["count"],
        rate: data.metrics[keyIterations]["values"]["count"] / 300,
        avg: data.metrics[keyIterationDuration]["values"]["avg"],
        min: data.metrics[keyIterationDuration]["values"]["min"],
        med: data.metrics[keyIterationDuration]["values"]["med"],
        max: data.metrics[keyIterationDuration]["values"]["max"],
        "p(90)": data.metrics[keyIterationDuration]["values"]["p(90)"],
        "p(95)": data.metrics[keyIterationDuration]["values"]["p(95)"],
      },
    };

    let keyHttpReqFailed = `http_req_failed{scenario:THREAD_${i}}`;
    let newKeyFailed = `FAILED_THREAD_${i}`;
    data.metrics[newKeyFailed] = {
      type: "counter",
      contains: "default",
      values: {
        count: data.metrics[keyHttpReqFailed]["values"]["passes"],
        rate: data.metrics[keyHttpReqFailed]["values"]["rate"],
      },
    };

    delete data.metrics[keyIterations];
    delete data.metrics[keyIterationDuration];
    delete data.metrics[keyHttpReqFailed];
  }

  return {
    "result.html": htmlReport(data, {
      title: `${serviceName} - ${currentDate}`,
    }),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

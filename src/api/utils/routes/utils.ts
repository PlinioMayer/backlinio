import { today } from "../controller/utils";

export default [
  {
    method: "GET",
    path: "/api/utils/today",
    handler: today,
    config: {
      auth: false,
    },
  },
];

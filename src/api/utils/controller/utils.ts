import { format } from "../../../utils";

export const today = (): string => {
  return format(new Date());
};

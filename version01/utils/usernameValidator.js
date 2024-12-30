import {Filter} from "bad-words";

const filter = new Filter();

export const isValidUsername = (username) => {
  return !filter.isProfane(username);
};
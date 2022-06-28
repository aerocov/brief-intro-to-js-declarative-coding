import * as R from "rambda";

console.log("==============================================================");
console.log("Example I");
console.log("==============================================================");
const mapleHouseMember = {
  id: "123",
  name: "Maple Lover",
  address: {
    street: "123 Main St",
    city: "Maple City",
    state: "MA",
    postcode: "3039",
    country: "Australia",
  },
};

type MapleHouseMember = typeof mapleHouseMember;

const formattedAddress = R.compose(
  R.join(", "),
  R.values,
  R.prop<"address", MapleHouseMember>("address")
);

const formattedAddress2 = R.compose(
  R.join(", "),
  R.props(["street", "city", "state", "postcode", "country"]),
  R.prop<"address", MapleHouseMember>("address")
);

console.log("input: ", mapleHouseMember);
console.log("formattedAddress:  ", formattedAddress(mapleHouseMember));
console.log("formattedAddress2: ", formattedAddress2(mapleHouseMember));

console.log("==============================================================");
console.log("Example II");
console.log("==============================================================");
const event = {
  key: "r",
  timestamp: 123456789,
};

const state = {
  noOfConsecutiveInvalidKeys: 5,
  canLaunch: false,
};

type Event = typeof event;
type State = typeof state;
const payload = { event, state };

type Payload = { event: Event; state: State };

const isCharacter = (key?: string) => key?.length === 1;
const isBackSpace = (key?: string) => key === "Backspace";
const isEscape = (key?: string) => key === "Escape";
const isEnter = (key?: string) => key === "Enter";

const viewKey = R.path<string>("event.key");

const isKeyInValid = R.complement(
  R.compose(R.anyPass([isCharacter, isBackSpace, isEscape, isEnter]), viewKey)
);

const isKeyCharacter = R.compose(isCharacter, viewKey);

const isKeyEnter = R.compose(isEnter, viewKey);

const incrementInvalidKeysCounter = R.evolve({
  state: { noOfConsecutiveInvalidKeys: R.inc },
});

const resetInvalidKeysCounter = R.evolve({
  state: { noOfConsecutiveInvalidKeys: R.always(0) },
});

const clearRunway = R.evolve({
  state: { canLaunch: R.always(true) },
});

const reduce = R.cond([
  [isKeyInValid, incrementInvalidKeysCounter],
  [isKeyCharacter, resetInvalidKeysCounter],
  [isKeyEnter, clearRunway],
  [R.T, R.identity],
]);

const input = { event, state };
const result = reduce(input);

console.log("input: ", input);
console.log("result: ", result);

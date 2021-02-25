import { PubSub } from "graphql-subscriptions";

enum Topic {
  NEW_VOTE = "newVote",
}

const pubsub = new PubSub();

export { Topic };
export default pubsub;

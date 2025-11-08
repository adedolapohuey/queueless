// src/serializers/user.serializer.ts
import { User } from "../models/user.model";

export function userSerializer(user: User) {
  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    organization: user.organization,
    isVerified: user.isVerified,
  };
}

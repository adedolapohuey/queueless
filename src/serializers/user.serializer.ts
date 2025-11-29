// src/serializers/user.serializer.ts
import { User } from "../models/user.model";

export function userSerializer(user: User) {
  return {
    userId: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    organization: user.organization,
    isVerified: user.isVerified,
  };
}

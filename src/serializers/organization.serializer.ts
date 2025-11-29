// src/serializers/user.serializer.ts
import { Organization } from "../models/organization.model";

export function orgSerializer(org: Organization) {
  return {
    orgId: org.id,
    name: org.name,
    email: org.email,
    description: org.description,
    domain: org.domain,
    isVerified: org.isVerified,
    isActive: org.isActive,
  };
}

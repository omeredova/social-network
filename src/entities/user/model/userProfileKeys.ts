export const userProfileKeys = {
  all: ['user-profiles'] as const,
  detail: (profileId: string) => [...userProfileKeys.all, profileId] as const,
  identity: (profileId: string) =>
    [...userProfileKeys.all, profileId, 'identity'] as const,
}
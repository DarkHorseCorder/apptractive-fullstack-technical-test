import { OnboardingStatus, User } from '../graphql';

/**
 * Gets the next step of onboarding based on user type
 * @param user
 */
export const getNextOnboardingStep = (user: User) => {
  const { onboardingStatus } = user;
  switch (onboardingStatus) {
    case OnboardingStatus.NAME:
      return OnboardingStatus.PROFILE_IMAGE;
    case OnboardingStatus.PROFILE_IMAGE:
      return OnboardingStatus.INTERESTS;
    case OnboardingStatus.INTERESTS:
      return OnboardingStatus.PLANS;
    case OnboardingStatus.PLANS:
      return OnboardingStatus.COMPLETED;
    default:
      return OnboardingStatus.COMPLETED;
  }
};

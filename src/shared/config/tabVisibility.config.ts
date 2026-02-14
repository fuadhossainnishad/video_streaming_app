// navigation/config/tabVisibility.config.ts

/**
 * Centralized configuration for tab bar visibility
 * Add screen names here to hide the main tab bar on those screens
 */

export const TAB_VISIBILITY_CONFIG = {
  // Screens where main tab bar should be hidden
  HIDDEN_SCREENS: [
    // Home Stack
    'Notification',
  ],

  // Tab names that should hide main tabs
  NESTED_TAB_SCREENS: [
    'AddTabs',
  ],
} as const;

/**
 * Check if tab bar should be visible for a given route
 * @param routeName - Current focused route name
 * @param tabName - Current tab name
 * @returns boolean - true if tab bar should be visible
 */
export const ShowTabBar = (
  routeName?: string,
  tabName?: string
): boolean => {
  const hiddenScreens = TAB_VISIBILITY_CONFIG.HIDDEN_SCREENS as readonly string[];
  const nestedTabs = TAB_VISIBILITY_CONFIG.NESTED_TAB_SCREENS as readonly string[];

  if (tabName && nestedTabs.includes(tabName)) {
    return true;
  }

  if (routeName && hiddenScreens.includes(routeName)) {
    return true;
  }

  return false;
};


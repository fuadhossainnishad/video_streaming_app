import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { StyleSheet, Text } from 'react-native';

import HomeStack from './HomeStack'; // your actual stack

// Your icons
import HomeIcon from '../../assets/icons/tabIcons/home.svg';
import HomeFocusedIcon from '../../assets/icons/tabIcons/inline-home.svg';
import ShortsIcon from '../../assets/icons/tabIcons/shorts.svg';
import ShortsFocusedIcon from '../../assets/icons/tabIcons/inline-shorts.svg';
import FollowIcon from '../../assets/icons/tabIcons/following.svg';
import FollowFocusedIcon from '../../assets/icons/tabIcons/inline-following.svg';
import ProfileIcon from '../../assets/icons/tabIcons/profile.svg';
import ProfileFocusedIcon from '../../assets/icons/tabIcons/inline-profile.svg';
import AddIcon from '../../assets/icons/tabIcons/add.svg';
import ShortsStack from './ShortsStack';
import FollowStack from './FollowStack';

export type MainTabParamList = {
  HomeStack: undefined;
  ShortsStack: undefined;
  AddStack: undefined;
  FollowStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabList = [
  {
    name: 'HomeStack',
    component: HomeStack,
    title: 'Home',
    activeIcon: HomeFocusedIcon,
    inactiveIcon: HomeIcon,
  },
  {
    name: 'ShortsStack',
    component: ShortsStack,
    title: 'Shorts',
    activeIcon: ShortsFocusedIcon,
    inactiveIcon: ShortsIcon,
  },
  {
    name: 'AddStack',
    component: () => <Text>Add</Text>,
    title: 'Add',
    activeIcon: AddIcon,
    inactiveIcon: AddIcon,
  },
  {
    name: 'FollowStack',
    component: FollowStack,
    title: 'Following',
    activeIcon: FollowFocusedIcon,
    inactiveIcon: FollowIcon,
  },
  {
    name: 'ProfileStack',
    component: FollowStack,
    title: 'Profile',
    activeIcon: ProfileFocusedIcon,
    inactiveIcon: ProfileIcon,
  },
];

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const hiddenRoutes: string[] = []; // add any screens where tab bar should hide

        const shouldHideTabBar = hiddenRoutes.includes(routeName);

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: shouldHideTabBar
            ? { display: 'none' }
            : {
                // // height:100,
                borderRadius: 20,
                // gap: 2,
                // backgroundColor: 'none',
                // // backgroundColor: '#1D35571A',
                margin: 20,
                // marginTop:40,
                // alignItems: 'center',
                paddingTop: 34,
                backgroundColor: '#1D35578A',
                borderTopWidth: 0,
                position: 'absolute',
                alignItems: 'center',
                left: 50,
                right: 50,
                bottom: 20,
                height: 62,
              },
          tabBarItemStyle: styles.tabBarItemStyle,
          // tabBarIconStyle: styles.tabBarIconStyle,
        };
      }}>
      {TabList.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as keyof MainTabParamList}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => {
              const IconComponent = focused ? tab.activeIcon : tab.inactiveIcon;
              const iconSize = 80;
              return <IconComponent width={iconSize} height={iconSize} />;
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    backgroundColor: '#1D3557',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    marginHorizontal: 80,
    // marginBottom: 10,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
  },

  tabBarItemStyle: {
    flex: 0,
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },

  // tabBarIconStyle: {
  //   width: 34,
  //   height: 34,
  // },
});

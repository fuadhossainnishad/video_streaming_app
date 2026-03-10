import React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Your icons
import CreatorHomeIcon from '../../assets/icons/home2.svg';
import CreatorHomeFocusedIcon from '../../assets/icons/home3.svg';
import HubIcon from '../../assets/icons/hub.svg';
import HubFocusedIcon from '../../assets/icons/hub2.svg';
import CommentsIcon from '../../assets/icons/comments.svg';
import CommentsFocusedIcon from '../../assets/icons/comments2.svg';
import ProfileIcon from '../../assets/icons/tabIcons/profile.svg';
import ProfileFocusedIcon from '../../assets/icons/tabIcons/inline-profile.svg';
import AddIcon from '../../assets/icons/tabIcons/add.svg';
import MainTabs from './MainTabs';
import { ShowTabBar } from '@/shared/config/tabVisibility.config';
import { useAppMode } from '@/context/ModeProvider';
import CreatorHomeStack from './creator/CreatorHomeStack';
import HubStack from './creator/HubStack';
import CreatorProfileStack from './creator/CreatorProfileStack';
import CommentsNotificationsScreen from '@/screens/creator/comments/CommentsNotificationsScreen';

export type AddTabParamList = {
    CreatorHomeStack: undefined;
    HubStack: undefined;
    MainTabs: undefined;
    CommentStack: undefined;
    CreatorProfileStack: undefined;
};

const Tab = createBottomTabNavigator<AddTabParamList>();

const TabList = [
    {
        name: 'CreatorHomeStack',
        component: CreatorHomeStack,
        title: 'CreatorHome',
        activeIcon: CreatorHomeFocusedIcon,
        inactiveIcon: CreatorHomeIcon,
    },
    {
        name: 'HubStack',
        component: HubStack,
        title: 'Hub',
        activeIcon: HubFocusedIcon,
        inactiveIcon: HubIcon,
    },
    {
        name: 'MainTabs',
        component: MainTabs,
        isSwitch: true,
        title: 'MainTab',
        activeIcon: AddIcon,
        inactiveIcon: AddIcon,
    },
    {
        name: 'CommentStack',
        component: CommentsNotificationsScreen,
        title: 'Comments',
        activeIcon: CommentsFocusedIcon,
        inactiveIcon: CommentsIcon,
    },
    {
        name: 'CreatorProfileStack',
        component: CreatorProfileStack,
        title: 'CreatorProfile',
        activeIcon: ProfileFocusedIcon,
        inactiveIcon: ProfileIcon,
    },
];

export default function AddTabs() {
    const { setMode } = useAppMode()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? '';
                // const hiddenRoutes: string[] = ['AddTabs']; // add any screens where tab bar should hide

                // const shouldHideTabBar = hiddenRoutes.includes(routeName);
                const shouldHideTabBar = ShowTabBar(routeName, route.name)
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
                    name={tab.name as keyof AddTabParamList}
                    component={tab.component}
                    listeners={
                        tab.isSwitch
                            ? {
                                tabPress: e => {
                                    e.preventDefault();
                                    setMode('user');
                                },
                            }
                            : undefined
                    }
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

import AppHeader from "@/components/AppHeader";
import { FollowParamalist } from "@/navigation/FollowStack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";

type Props = NativeStackNavigationProp<FollowParamalist, 'ChannelOverview'>;

export default function ChannelOverviewScreen() {
    const navigation = useNavigation<Props>()
    return (
        <View>
            <AppHeader title="Notifications" onPress={() => navigation.goBack()} />
        </View>
    )
}
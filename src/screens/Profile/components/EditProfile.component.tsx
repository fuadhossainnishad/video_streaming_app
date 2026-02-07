import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import ArrowIcon from '../../../../assets/icons/arrow.svg'

export default function EditProfileComponent() {
    return (
        <View className='flex-row gap-2 max-h-fit'>
            <Image
                source={require('../../../../assets/poster/profile.jpg')}
                className='rounded-2xl h-full w-16 '
            />
            <View>
                <Text className="text-base font-semibold text-white">ArrowIcon</Text>
                <Text className="text-sm font-normal text-white">ArrowIcon</Text>
                <TouchableOpacity className='self-end flex-row items-center gap-4'>
                    <Text className="text-sm font-normal text-[#9BD71B]">View channel</Text>
                    <ArrowIcon height={12} />
                </TouchableOpacity>
            </View>
            <ArrowIcon height={12} />
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
// });
import { Text, TouchableOpacity, View } from "react-native";
import StarIcon from '../../../../assets/icons/star.svg';

export interface IProfileHeader {
    text: string
    RightIcon: React.ElementType
}

export default function ProfileHeader({ text, RightIcon }: IProfileHeader) {

    return (
        <View style={styles.headerContainer}>
            <Logo height={80} width={80} />
            <View style={styles.headerRight}>
                <TouchableOpacity
                    onPress={() => { }}
                    style={styles.buttonContent}
                    className='border border-[#9BD71B]/50 px-5 py-3.5 rounded-2xl'
                >
                    <StarIcon height={20} width={20} />
                    <Text style={styles.buttonText}>Go Pro</Text>
                </TouchableOpacity>
                {/* <GradientBorder2 borderRadius={18} borderWidth={2}>
                <View style={styles.buttonContent}>
                  <StarIcon height={24} width={24} />
                  <Text style={styles.buttonText}>Go Pro</Text>
                </View>
              </GradientBorder2> */}
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <RightIcon height={50} width={50} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
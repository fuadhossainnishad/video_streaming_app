import AppHeader from '@/components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CopyIcon from '../../../assets/icons/copy.svg';
import MaskedView from '@react-native-masked-view/masked-view';
import CrossIcon from '../../../assets/icons/cross2.svg';
import Illustration from '../../../assets/icons/Illustration.svg';

type Props = NativeStackNavigationProp<ProfileParamalist, 'Saved'>;

export default function GoproScreen() {
  // const coupons = [
  //   {
  //     id: 1,
  //     discount: '25%',
  //     title: 'Get 25% off when you renew your subscription',
  //     code: 'FREESHIP2025',
  //     bgColors: ['#9BD71B', '#7AB616'],
  //   },
  // ];
  const navigation = useNavigation<Props>();

  // const handleCopyCode = (code: string) => {
  //   // Implement copy to clipboard
  //   console.log('Copied:', code);
  // };

  return (
    <SafeAreaView edges={['top']} className="gap-4 bg-black p-4" style={styles.container}>
      <AppHeader title="" LeftIcon={CrossIcon} onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View className="h-20 w-full p-10">
          <Illustration height={400} width={50} className="w-full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    gap: 20,
  },
  couponWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  couponCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 140,
  },
  leftSection: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  discountText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 52,
  },
  offText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: -8,
  },
  divider: {
    width: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  rightSection: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 20,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  copyText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9BD71B',
  },
  cutoutLeft: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -12,
    marginTop: -12,
  },
  cutoutRight: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -12,
    marginTop: -12,
  },
  text: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
  },
});

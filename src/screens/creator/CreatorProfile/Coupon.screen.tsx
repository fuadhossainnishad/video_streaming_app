import AppHeader from '@/components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileParamalist } from '@/navigation/ProfileStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CopyIcon from '../../../assets/icons/copy.svg'
import MaskedView from '@react-native-masked-view/masked-view';

type Props = NativeStackNavigationProp<ProfileParamalist, 'Saved'>;

export default function CouponScreen() {
  const coupons = [
    {
      id: 1,
      discount: '25%',
      title: 'Get 25% off when you renew your subscription',
      code: 'FREESHIP2025',
      bgColors: ['#9BD71B', '#7AB616'],
    },
  ]
  const navigation = useNavigation<Props>();

  const handleCopyCode = (code: string) => {
    // Implement copy to clipboard
    console.log('Copied:', code);
  };

  return (
    <SafeAreaView
      edges={['top']}
      className='bg-black p-4 gap-4'
      style={styles.container}
    >
      <AppHeader title="Coupon Cards" onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {coupons.map((coupon, index) => (
          <View key={coupon.id} style={styles.couponWrapper}>
            <View
              className='bg-white/20 '
              style={styles.couponCard}
            >
              {/* Left Section - Discount */}
              <View style={styles.leftSection}>
                <MaskedView
                  maskElement={
                    <Text style={styles.text}>
                      {coupon.discount}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#E8FF8B', '#9BD71B', '#7AB616']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {/* This text is invisible, only used for size */}
                    <Text style={[styles.text, { opacity: 0 }]}>
                      {coupon.discount}
                    </Text>
                  </LinearGradient>
                </MaskedView>
                {/* <Text style={styles.discountText}>{coupon.discount}</Text> */}
              </View>

              {/* Dotted Divider */}
              <View style={styles.divider}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>

              {/* Right Section - Details */}
              <View style={styles.rightSection}>
                <Text style={styles.couponTitle}>{coupon.title}</Text>

                <View style={styles.codeContainer}>
                  <Text
                    className='text-lg font-semibold'
                    style={styles.codeLabel}>CODE:</Text>
                  <Text
                    className='text-lg font-semibold'
                    style={styles.codeText}>{coupon.code}</Text>
                </View>

                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => handleCopyCode(coupon.code)}
                >
                  <Text style={styles.copyText}>Copy code</Text>
                  <CopyIcon height={16} width={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cutout circles */}
            <View style={[styles.cutoutLeft, { backgroundColor: '#17191A' }]} />
            <View style={[styles.cutoutRight, { backgroundColor: '#17191A' }]} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView >
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

// presentation/Channel/components/ChannelStatsCard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ChannelDetailsData, ChannelStats } from '@/shared/types/channel.types';
import { formatNumber, formatCurrency, formatHours } from '@/shared/utils/channel.utils';
import { getMyChannel } from '@/domain/video/api/channel.service';
import { LinearGradient } from 'expo-linear-gradient';

// interface ChannelStatsCardProps {
//     stats: ChannelStats;
// }

export default function ChannelStatsCard() {
  const [stats, setStats] = useState<ChannelDetailsData>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('stats:', stats);

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getMyChannel();
      setStats(result);
    } catch (err: any) {
      console.error('Error fetching Stats:', err);
      setError(err.message || 'Failed to load Stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#9BD71B" />
          <Text className="mt-4 text-gray-400">Loading videos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="mb-4 text-center text-red-400">{error}</Text>
          <TouchableOpacity
            onPress={() => fetchStats()}
            className="rounded-xl bg-[#9BD71B] px-6 py-3">
            <Text className="font-semibold text-black">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!stats) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-center text-gray-400">No data available at the moment</Text>
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9BD71B"
            colors={['#9BD71B']}
          />
        </View>
      );
    }

    return (
      <LinearGradient colors={['#AEFF001A', '#000000']} style={styles.container}>
        <View style={styles.header}>
          {/* Channel Icon */}
          <View style={styles.iconContainer}>
            <Image source={{ uri: stats.avatar }} style={styles.channelIcon} resizeMode="cover" />
          </View>

          {/* Channel Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.channelName}>{stats.name}</Text>
            <Text style={styles.email}>{stats.ownerEmail}</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total followers - </Text>
                <Text style={styles.statValue}>{formatNumber(stats.followers)} followers</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total views - </Text>
                <Text style={styles.statValue}>{formatNumber(stats.totalViews)}</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Revenue - </Text>
                <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
              </View>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total watch time - </Text>
                <Text style={styles.statValue}>{formatHours(stats.totalWatchTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{stats.description}</Text>
      </LinearGradient>
    );
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  channelIcon: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#3C3C3E',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  channelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statsGrid: {
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statValue: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
});

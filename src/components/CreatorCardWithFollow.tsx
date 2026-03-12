// components/CreatorCardWithFollow.tsx
import React from 'react';
import { useFollow } from '@/shared/hooks/useFollow';
import { DiscoveryChannelData } from '@/shared/types/channel.types';
import CreatorCard from './CreatorCard';

interface CreatorCardWithFollowProps {
    channel: DiscoveryChannelData;
    onPress?: () => void;
}

export default function CreatorCardWithFollow({
    channel,
    onPress,
}: CreatorCardWithFollowProps) {
    const {
        isFollowing,
        followersCount,
        checking,
        loading,
        toggleFollow,
    } = useFollow(
        channel.id ?? '',
        channel.totalfollowers ?? 0,
    );

    return (
        <CreatorCard
            avatar={channel.avatar}
            name={channel.name}
            followers={followersCount}
            isFollowing={isFollowing}
            checking={checking}
            loading={loading}
            onToggle={toggleFollow}
            onPress={onPress}
        />
    );
}
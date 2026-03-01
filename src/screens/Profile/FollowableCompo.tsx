import CreatorCard from "@/components/CreatorCard";
import { useFollow } from "@/shared/hooks/useFollow";
import { UIChannel } from "@/shared/utils/follow.utils";

type FollowableCreatorProps = {
    creator: UIChannel;
};

const FollowableCreator = ({ creator }: FollowableCreatorProps) => {
    const {
        isFollowing,
        followersCount,
        loading,
        toggleFollow,
    } = useFollow(
        creator.id,
        Number(creator.followers)
    );

    return (
        <CreatorCard
            avatar={creator.avatar}
            name={creator.name}
            followers={followersCount}
            isFollowing={isFollowing}
            loading={loading}
            onToggle={toggleFollow}
        />
    );
};

export default FollowableCreator;
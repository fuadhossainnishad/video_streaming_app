import { FollowingResponse } from '@/shared/types/follow.types';

export const mockFollowingResponse: FollowingResponse = {
    "status": "success",
    "message": "Successfully retrieved followed channels",
    "data": {
        "subscriptions": [
            {
                "followId": "697bd2ae6d0e9c048caa2851",
                "followedAt": "2026-01-29T21:35:42.595Z",
                "notificationsEnabled": true,
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "description": "bio .......... fuck you",
                    "totalfollowers": 1,
                    "totalViews": 5,
                    "owner": {
                        "_id": "6957032e3dc0ff9bce625684",
                        "username": "rayhan shishir"
                    }
                }
            },
            {
                "followId": "697bd2ae6d0e9c048caa2851",
                "followedAt": "2026-01-29T21:35:42.595Z",
                "notificationsEnabled": true,
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "description": "bio .......... fuck you",
                    "totalfollowers": 1,
                    "totalViews": 5,
                    "owner": {
                        "_id": "6957032e3dc0ff9bce625684",
                        "username": "rayhan shishir"
                    }
                }
            },
            {
                "followId": "697bd2ae6d0e9c048caa2851",
                "followedAt": "2026-01-29T21:35:42.595Z",
                "notificationsEnabled": true,
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "description": "bio .......... fuck you",
                    "totalfollowers": 1,
                    "totalViews": 5,
                    "owner": {
                        "_id": "6957032e3dc0ff9bce625684",
                        "username": "rayhan shishir"
                    }
                }
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalSubscriptions": 3,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}

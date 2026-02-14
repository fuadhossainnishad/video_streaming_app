import { ApiShortByIdResponse, ApiShortResponse } from "../types/shorts.types";

export const mockShortsResponse: ApiShortResponse = {
    "status": "success",
    "data": {
        "shorts": [
            {
                "_id": "696176fa3212ed57f24fcfb0",
                "title": "I'm devil fuhad",
                "description": "",
                "videoUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                "hashtags": [
                    "#viral",
                    "#funny",
                    "#trending"
                ],
                "owner": {
                    "_id": "6957032e3dc0ff9bce625684",
                    "username": "rayhan shishir",
                    "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
                },
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "totalfollowers": 0
                },
                "totalViews": 0,
                "likesCount": 0,
                "dislikesCount": 0,
                "commentsCount": 0,
                "totalRevenue": 0,
                "watchTime": 0,
                "isPublished": false,
                "visibility": "public",
                "duration": 0,
                "category": "Entertainment",
                "language": "en",
                "transcodeJobId": "1767995134969-xrf7qj",
                "transcodeStatus": "COMPLETE",
                "createdAt": "2026-01-09T21:45:30.655Z",
                "updatedAt": "2026-01-09T21:45:30.655Z",
                "streamingUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/shorts/6957032e3dc0ff9bce625684/1767993601913/index.m3u8"
            },
            {
                "_id": "696176e33212ed57f24fcfad",
                "title": "rafi 1 min hot video",
                "description": "",
                "videoUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                "hashtags": [
                    "#viral",
                    "#funny",
                    "#trending"
                ],
                "owner": {
                    "_id": "6957032e3dc0ff9bce625684",
                    "username": "rayhan shishir",
                    "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
                },
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "totalfollowers": 0
                },
                "totalViews": 0,
                "likesCount": 0,
                "dislikesCount": 0,
                "commentsCount": 0,
                "totalRevenue": 0,
                "watchTime": 0,
                "isPublished": false,
                "visibility": "public",
                "duration": 0,
                "category": "Entertainment",
                "language": "en",
                "transcodeJobId": "1767995111969-hflh6x",
                "transcodeStatus": "PROGRESSING",
                "createdAt": "2026-01-09T21:45:07.593Z",
                "updatedAt": "2026-01-09T21:45:07.593Z",
                "streamingUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/shorts/6957032e3dc0ff9bce625684/1767993601913/index.m3u8"
            },
            {
                "_id": "696171043212ed57f24fcfa1",
                "title": "Updated Title",
                "description": "Updated description",
                "videoUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                "hashtags": [
                    "#new",
                    "#updated"
                ],
                "owner": {
                    "_id": "6957032e3dc0ff9bce625684",
                    "username": "rayhan shishir",
                    "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
                },
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a",
                    "channelName": "rayhan dev channel",
                    "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                    "totalfollowers": 0
                },
                "totalViews": 4,
                "likesCount": 0,
                "dislikesCount": 0,
                "commentsCount": 0,
                "totalRevenue": 0,
                "watchTime": 0,
                "isPublished": false,
                "visibility": "public",
                "duration": 0,
                "category": "Comedy",
                "language": "en",
                "transcodeJobId": "1767993608261-o9a6ie",
                "transcodeStatus": "COMPLETE",
                "createdAt": "2026-01-09T21:20:04.038Z",
                "updatedAt": "2026-01-09T21:55:17.094Z",
                "streamingUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/shorts/6957032e3dc0ff9bce625684/1767993601913/index.m3u8"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalShorts": 3,
            "hasMore": false
        }
    }
}

export const mockShortByIdResponse: ApiShortByIdResponse = {
    "status": "success",
    "data": {
        "short": {
            "_id": "696171043212ed57f24fcfa1",
            "title": "rafi 1 min hot video",
            "description": "",
            "videoUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/shorts/6957032e3dc0ff9bce625684/1767993601913/index.m3u8",
            "hashtags": [
                "#viral",
                "#funny",
                "#trending"
            ],
            "owner": {
                "_id": "6957032e3dc0ff9bce625684",
                "username": "rayhan shishir",
                "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
            },
            "channel": {
                "_id": "69570442ce4c2a5636bc700a",
                "channelName": "rayhan dev channel",
                "description": "bio .......... fuck you",
                "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
                "totalfollowers": 0
            },
            "totalViews": 0,
            "likesCount": 0,
            "dislikesCount": 0,
            "commentsCount": 0,
            "totalRevenue": 0,
            "watchTime": 0,
            "isPublished": false,
            "visibility": "public",
            "duration": 0,
            "category": "Entertainment",
            "language": "en",
            "transcodeJobId": "1767993608261-o9a6ie",
            "transcodeStatus": "COMPLETE",
            "createdAt": "2026-01-09T21:20:04.038Z",
            "updatedAt": "2026-01-09T21:21:39.765Z",
            "streamingUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/shorts/6957032e3dc0ff9bce625684/1767993601913/index.m3u8"
        }
    }
}
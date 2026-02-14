// domain/video/mock/video.mock.ts

import { ApiVideoByIdResponse, ApiVideoResponse } from "../types/video.types";


export const mockVideoResponse: ApiVideoResponse = {
    status: 'success',
    data: {
        videos: [
            {
                _id: 'video_1',
                title: 'Build REST API with Node.js & Express',
                description:
                    'Complete beginner to advanced REST API tutorial using Node.js, Express and MongoDB.',
                thumbnail:
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
                videoUrl:
                    'https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8',
                hashtags: ['#nodejs', '#express', '#mongodb'],
                links: ['https://github.com/example/repo'],
                owner: {
                    _id: 'owner_1',
                    username: 'Rayhan Dev',
                    avatar:
                        'https://randomuser.me/api/portraits/men/32.jpg',
                },
                channel: {
                    _id: 'channel_1',
                    channelName: 'Rayhan Dev Channel',
                    channelIcon:
                        'https://randomuser.me/api/portraits/men/32.jpg',
                    totalfollowers: 1250,
                },
                totalViews: 15420,
                likesCount: 980,
                dislikesCount: 12,
                commentsCount: 86,
                totalRevenue: 120,
                watchTime: 54000,
                isPublished: true,
                visibility: 'public',
                duration: 1250,
                category: 'Education',
                language: 'en',
                transcodeStatus: 'COMPLETE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            {
                _id: 'video_2',
                title: 'Master React Native in 30 Minutes',
                description:
                    'Crash course on React Native including navigation, state management and animations.',
                thumbnail:
                    'https://images.unsplash.com/photo-1581276879432-15e50529f34b',
                videoUrl:
                    'https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8',
                hashtags: ['#reactnative', '#mobiledev'],
                links: [],
                owner: {
                    _id: 'owner_2',
                    username: 'Fuad Codes',
                    avatar:
                        'https://randomuser.me/api/portraits/men/44.jpg',
                },
                channel: {
                    _id: 'channel_2',
                    channelName: 'Fuad Academy',
                    channelIcon:
                        'https://randomuser.me/api/portraits/men/44.jpg',
                    totalfollowers: 540,
                },
                totalViews: 8450,
                likesCount: 430,
                dislikesCount: 5,
                commentsCount: 23,
                totalRevenue: 45,
                watchTime: 21000,
                isPublished: true,
                visibility: 'public',
                duration: 1800,
                category: 'Programming',
                language: 'en',
                transcodeStatus: 'COMPLETE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },

            {
                _id: 'video_3',
                title: 'Understanding Clean Architecture',
                description:
                    'Learn how to structure large scale apps using clean architecture principles.',
                thumbnail:
                    'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                videoUrl:
                    'https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8',
                hashtags: ['#cleanarchitecture', '#softwaredesign'],
                links: [],
                owner: {
                    _id: 'owner_3',
                    username: 'Architecture Guru',
                    avatar:
                        'https://randomuser.me/api/portraits/women/65.jpg',
                },
                channel: {
                    _id: 'channel_3',
                    channelName: 'System Design Hub',
                    channelIcon:
                        'https://randomuser.me/api/portraits/women/65.jpg',
                    totalfollowers: 3200,
                },
                totalViews: 22100,
                likesCount: 1500,
                dislikesCount: 22,
                commentsCount: 190,
                totalRevenue: 320,
                watchTime: 98000,
                isPublished: true,
                visibility: 'public',
                duration: 2400,
                category: 'Software Engineering',
                language: 'en',
                transcodeStatus: 'PROGRESSING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                _id: 'video_3',
                title: 'Understanding Clean Architecture',
                description:
                    'Learn how to structure large scale apps using clean architecture principles.',
                thumbnail:
                    'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
                videoUrl:
                    'https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8',
                hashtags: ['#cleanarchitecture', '#softwaredesign'],
                links: [],
                owner: {
                    _id: 'owner_3',
                    username: 'Architecture Guru',
                    avatar:
                        'https://randomuser.me/api/portraits/women/65.jpg',
                },
                channel: {
                    _id: 'channel_3',
                    channelName: 'System Design Hub',
                    channelIcon:
                        'https://randomuser.me/api/portraits/women/65.jpg',
                    totalfollowers: 3200,
                },
                totalViews: 22100,
                likesCount: 1500,
                dislikesCount: 22,
                commentsCount: 190,
                totalRevenue: 320,
                watchTime: 98000,
                isPublished: true,
                visibility: 'public',
                duration: 2400,
                category: 'Software Engineering',
                language: 'en',
                transcodeStatus: 'PROGRESSING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                _id: 'video_1',
                title: 'Build REST API with Node.js & Express',
                description:
                    'Complete beginner to advanced REST API tutorial using Node.js, Express and MongoDB.',
                thumbnail:
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
                videoUrl:
                    'https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8',
                hashtags: ['#nodejs', '#express', '#mongodb'],
                links: ['https://github.com/example/repo'],
                owner: {
                    _id: 'owner_1',
                    username: 'Rayhan Dev',
                    avatar:
                        'https://randomuser.me/api/portraits/men/32.jpg',
                },
                channel: {
                    _id: 'channel_1',
                    channelName: 'Rayhan Dev Channel',
                    channelIcon:
                        'https://randomuser.me/api/portraits/men/32.jpg',
                    totalfollowers: 1250,
                },
                totalViews: 15420,
                likesCount: 980,
                dislikesCount: 12,
                commentsCount: 86,
                totalRevenue: 120,
                watchTime: 54000,
                isPublished: true,
                visibility: 'public',
                duration: 1250,
                category: 'Education',
                language: 'en',
                transcodeStatus: 'COMPLETE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],

        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalVideos: 3,
            hasMore: false,
        },
    },
};


export const mockVideoByIdResponse: ApiVideoByIdResponse = {
    "status": "success",
    "data": {
        "video": {
            "_id": "695ad1bf9919b2e1e770b8f3",
            "title": "How to Build a REST API with Node.js and Express",
            "description": "In this comprehensive tutorial, we'll walk through building a complete REST API from scratch using Node.js and Express. Perfect for beginners and intermediate developers!",
            "thumbnail": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/cf4f6646-b164-4b2f-b4f5-8466b267aafa.png",
            "videoUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8",
            "hashtags": [
                "#nodejs",
                "#express",
                "#restapi",
                "#tutorial"
            ],
            "links": [
                "https://github.com/myrepo/rest-api",
                "https://docs.example.com"
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
            "category": "Education",
            "language": "en",
            "transcodeJobId": "1767559615174-onwrub",
            "transcodeStatus": "COMPLETE",
            "createdAt": "2026-01-04T20:46:55.023Z",
            "updatedAt": "2026-01-04T20:58:15.438Z",
            "streamingUrl": "https://lnkm-media-outputs.s3.eu-north-1.amazonaws.com/videos/6957032e3dc0ff9bce625684/1767559614065/index.m3u8"
        }
    }
}
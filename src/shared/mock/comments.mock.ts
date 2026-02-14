import { ApiCommentsResponse } from "../types/comments.type";

export const mockCommentsResponse: ApiCommentsResponse = {
    "status": "success",
    "data": {
        "comments": [
            {
                "_id": "6962b8ea54139294c867baab",
                "content": "This is an amazing video! Really helpful tutorial. Edit: Thanks for 100 likes!",
                "user": {
                    "_id": "6957032e3dc0ff9bce625684",
                    "username": "rayhan shishir",
                    "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
                },
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a"
                },
                "targetType": "Video",
                "targetId": "6958694c5bc48daff6c7a108",
                "parentComment": null,
                "isReply": false,
                "likesCount": 0,
                "dislikesCount": 0,
                "repliesCount": 2,
                "isEdited": true,
                "isPinned": false,
                "isDeleted": false,
                "createdAt": "2026-01-10T20:39:06.028Z",
                "updatedAt": "2026-01-10T21:01:58.326Z"
            },
            {
                "_id": "6962b8ea54139294c867baac",
                "content": "This is an amazing video! Really helpful tutorial. Edit: Thanks for 100 likes!",
                "user": {
                    "_id": "6957032e3dc0ff9bce625684",
                    "username": "rayhan shishir",
                    "avatar": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/60612152-f1e5-4ea6-bcc1-3f08e39aac96.jpg"
                },
                "channel": {
                    "_id": "69570442ce4c2a5636bc700a"
                },
                "targetType": "Video",
                "targetId": "6958694c5bc48daff6c7a108",
                "parentComment": null,
                "isReply": false,
                "likesCount": 0,
                "dislikesCount": 0,
                "repliesCount": 2,
                "isEdited": true,
                "isPinned": false,
                "isDeleted": false,
                "createdAt": "2026-01-10T20:39:06.028Z",
                "updatedAt": "2026-01-10T21:01:58.326Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 1,
            "pages": 1
        }
    }
}
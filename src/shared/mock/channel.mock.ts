import { ApiAllChannelsResponse, ApiChannelByIdResponse } from "../types/channel.types"

export const mockTopChannelsResponse: ApiAllChannelsResponse = {
    "status": "success",
    "data": [
        {
            "_id": "6956e58b2db2dcd94e40dd28",
            "channelName": "rayhan dev channel",
            "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/694db59b4b85c65dcaf55daf/2db26964-9299-49ca-8fcb-96b2c904298d.jpg"
        },
        {
            "_id": "695701dc3dc0ff9bce62566f",
            "channelName": "shishir channel",
            "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6956f89d3dc0ff9bce62566a/44a86c6a-d8eb-4df5-b935-5ec12dbcf3db.jpg"
        },
        {
            "_id": "69570442ce4c2a5636bc700a",
            "channelName": "rayhan dev channel",
            "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg"
        }
    ]
}

export const mockChannelDetailsResponse: ApiChannelByIdResponse = {
    "status": "success",
    "data": {
        "_id": "69570442ce4c2a5636bc700a",
        "channelName": "rayhan dev channel",
        "description": "bio .......... fuck you",
        "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
        "owner": {
            "_id": "6957032e3dc0ff9bce625684",
            "username": "rayhan shishir",
            "email": "rayhanshishir@gmail.com"
        },
        "links": "https://instagram.com/mychannel https://instagram.com/mychannel",
        "totalfollowers": 0,
        "totalViews": 0,
        "totalRevenue": 0,
        "totalWatchTime": 0,
        "createdAt": "2026-01-01T23:33:22.971Z",
        "updatedAt": "2026-01-01T23:33:47.560Z"
    }
}

export const mockMychannelResponse: ApiChannelByIdResponse = {
    "status": "success",
    "data": {
        "_id": "69570442ce4c2a5636bc700a",
        "channelName": "rayhan dev channel",
        "description": "bio .......... fuck you",
        "channelIcon": "https://lnkm-image-bucket.s3.eu-north-1.amazonaws.com/image/6957032e3dc0ff9bce625684/560123f1-33d5-42b0-b00a-d4b9e6617a73.jpg",
        "owner": {
            "_id": "6957032e3dc0ff9bce625684",
            "username": "rayhan shishir",
            "email": "rayhanshishir@gmail.com"
        },
        "links": "https://instagram.com/mychannel https://instagram.com/mychannel",
        "totalfollowers": 0,
        "totalViews": 0,
        "totalRevenue": 0,
        "totalWatchTime": 0,
        "createdAt": "2026-01-01T23:33:22.971Z",
        "updatedAt": "2026-01-01T23:33:47.560Z"
    }
}
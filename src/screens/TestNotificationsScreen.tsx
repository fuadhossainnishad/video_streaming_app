// // src/screens/TestNotificationsScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Clipboard from '@react-native-clipboard/clipboard';
// import messaging from '@react-native-firebase/messaging';
// import {
//   scheduleLocalNotification,
//   requestNotificationPermissions,
// } from '@/services/notifications/notifications.service';

// export default function TestNotificationsScreen() {
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

//   useEffect(() => {
//     initializeNotifications();
//   }, []);

//   const initializeNotifications = async () => {
//     try {
//       // Request permissions
//       const granted = await requestNotificationPermissions();
//       setPermissionStatus(granted ? 'granted' : 'denied');

//       if (granted) {
//         // Get FCM token
//         const token = await messaging().getToken();
//         setFcmToken(token);
//         console.log('FCM Token:', token);
//       }
//     } catch (error) {
//       console.error('Error initializing notifications:', error);
//     }
//   };

//   const copyTokenToClipboard = () => {
//     if (fcmToken) {
//       Clipboard.setString(fcmToken);
//       Alert.alert('Success', 'Token copied to clipboard!');
//     }
//   };

//   const testLocalNotification = async () => {
//     try {
//       await scheduleLocalNotification(
//         'Test Notification 🔔',
//         'This is a test notification from your app!',
//         { type: 'test' },
//         0 // Send immediately
//       );
//       Alert.alert('Success', 'Local notification sent!');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to send notification');
//     }
//   };

//   const testDelayedNotification = async () => {
//     try {
//       await scheduleLocalNotification(
//         'Delayed Notification ⏰',
//         'This notification was scheduled 5 seconds ago',
//         { type: 'test' },
//         5 // Send in 5 seconds
//       );
//       Alert.alert('Success', 'Notification will appear in 5 seconds');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to schedule notification');
//     }
//   };

//   const testLikeNotification = async () => {
//     await scheduleLocalNotification(
//       'New Like! 👍',
//       'John liked your video',
//       {
//         type: 'like',
//         targetId: '123',
//         userId: '456',
//         username: 'John',
//       },
//       0
//     );
//   };

//   const testCommentNotification = async () => {
//     await scheduleLocalNotification(
//       'New Comment 💬',
//       'Sarah: Great video!',
//       {
//         type: 'comment',
//         targetId: '123',
//         userId: '789',
//         username: 'Sarah',
//       },
//       0
//     );
//   };

//   const testFollowNotification = async () => {
//     await scheduleLocalNotification(
//       'New Follower 🎉',
//       'Mike started following you',
//       {
//         type: 'follow',
//         userId: '999',
//         username: 'Mike',
//       },
//       0
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-black p-4">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Text className="mb-6 text-2xl font-bold text-white">
//           Test Notifications
//         </Text>

//         {/* Permission Status */}
//         <View className="mb-6 rounded-xl bg-white/10 p-4">
//           <Text className="mb-2 text-base font-semibold text-white">
//             Permission Status
//           </Text>
//           <View
//             className={`rounded-lg px-3 py-2 ${
//               permissionStatus === 'granted'
//                 ? 'bg-green-500/20'
//                 : 'bg-red-500/20'
//             }`}>
//             <Text
//               className={`text-sm font-medium ${
//                 permissionStatus === 'granted'
//                   ? 'text-green-400'
//                   : 'text-red-400'
//               }`}>
//               {permissionStatus.toUpperCase()}
//             </Text>
//           </View>
//         </View>

//         {/* FCM Token */}
//         <View className="mb-6 rounded-xl bg-white/10 p-4">
//           <Text className="mb-2 text-base font-semibold text-white">
//             FCM Token
//           </Text>
//           {fcmToken ? (
//             <>
//               <Text
//                 className="mb-3 text-xs text-gray-400"
//                 numberOfLines={3}>
//                 {fcmToken}
//               </Text>
//               <TouchableOpacity
//                 onPress={copyTokenToClipboard}
//                 className="rounded-lg bg-[#9BD71B] px-4 py-2">
//                 <Text className="text-center font-semibold text-black">
//                   Copy Token
//                 </Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <Text className="text-sm text-gray-400">
//               Token not available
//             </Text>
//           )}
//         </View>

//         {/* Local Notification Tests */}
//         <View className="mb-4">
//           <Text className="mb-3 text-lg font-bold text-white">
//             Local Notifications
//           </Text>

//           <TouchableOpacity
//             onPress={testLocalNotification}
//             className="mb-3 rounded-xl bg-blue-500 px-4 py-3">
//             <Text className="text-center font-semibold text-white">
//               Test Basic Notification
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={testDelayedNotification}
//             className="mb-3 rounded-xl bg-purple-500 px-4 py-3">
//             <Text className="text-center font-semibold text-white">
//               Test Delayed Notification (5s)
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={testLikeNotification}
//             className="mb-3 rounded-xl bg-pink-500 px-4 py-3">
//             <Text className="text-center font-semibold text-white">
//               Test Like Notification
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={testCommentNotification}
//             className="mb-3 rounded-xl bg-green-500 px-4 py-3">
//             <Text className="text-center font-semibold text-white">
//               Test Comment Notification
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={testFollowNotification}
//             className="mb-3 rounded-xl bg-yellow-500 px-4 py-3">
//             <Text className="text-center font-semibold text-black">
//               Test Follow Notification
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Instructions */}
//         <View className="mb-6 rounded-xl bg-white/5 p-4">
//           <Text className="mb-2 text-base font-semibold text-white">
//             📋 How to Test from Firebase Console
//           </Text>
//           <Text className="mb-2 text-sm leading-6 text-gray-400">
//             1. Copy your FCM token above
//           </Text>
//           <Text className="mb-2 text-sm leading-6 text-gray-400">
//             2. Go to Firebase Console → Cloud Messaging
//           </Text>
//           <Text className="mb-2 text-sm leading-6 text-gray-400">
//             3. Click "Send your first message"
//           </Text>
//           <Text className="mb-2 text-sm leading-6 text-gray-400">
//             4. Click "Send test message"
//           </Text>
//           <Text className="mb-2 text-sm leading-6 text-gray-400">
//             5. Paste your token
//           </Text>
//           <Text className="text-sm leading-6 text-gray-400">
//             6. Click "Test"
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
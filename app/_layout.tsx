import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initializeDatabase } from '../database/database';

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] =
    useState(false);

  useEffect(() => {
    async function setupDatabase() {
      try {
        await initializeDatabase();

        console.log('Database initialized');

        setDatabaseReady(true);
      } catch (error) {
        console.error(
          'Database initialization failed:',
          error
        );
      }
    }

    setupDatabase();
  }, []);

  if (!databaseReady) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F7F7F7',
          }}
        >
          <ActivityIndicator size="small" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
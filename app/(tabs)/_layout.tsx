import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';

const TAB_WIDTH = 70;

function LiquidGlassTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const insets = useSafeAreaInsets();

  const [barWidth, setBarWidth] = useState(0);

  const indicatorX = useRef(
    new Animated.Value(0)
  ).current;

  const routes = state.routes;

  const activeIndex = state.index;

  useEffect(() => {
    if (!barWidth) return;

    const tabWidth = barWidth / routes.length;

    Animated.spring(indicatorX, {
      toValue:
        activeIndex * tabWidth +
        (tabWidth - TAB_WIDTH) / 2,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    }).start();
  }, [
    activeIndex,
    barWidth,
    routes.length,
    indicatorX,
  ]);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.barShadow}>
        <BlurView
          intensity={90}
          tint="light"
          style={styles.blur}
        >
          {/* Top glass reflection */}
          <View style={styles.glassHighlight} />

          {/* Moving active glass */}
          {barWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.activeGlass,
                {
                  transform: [
                    {
                      translateX: indicatorX,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.activeInner} />
            </Animated.View>
          )}

          <View
            style={styles.tabsContainer}
            onLayout={(event) => {
              setBarWidth(
                event.nativeEvent.layout.width
              );
            }}
          >
            {routes.map(
              (
                route: any,
                index: number
              ) => {
                const { options } =
                  descriptors[route.key];

                const focused =
                  state.index === index;

                const color = focused
                  ? '#111111'
                  : '#77777C';

                let iconName: any;

                if (route.name === 'index') {
                  iconName = focused
                    ? 'home'
                    : 'home-outline';
                }

                if (route.name === 'expenses') {
                  iconName = focused
                    ? 'card'
                    : 'card-outline';
                }

                if (route.name === 'budgets') {
                  iconName = focused
                    ? 'wallet'
                    : 'wallet-outline';
                }

                if (route.name === 'reports') {
                  iconName = focused
                    ? 'pie-chart'
                    : 'pie-chart-outline';
                }

                const onPress = () => {
                  const event =
                    navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                  if (
                    !focused &&
                    !event.defaultPrevented
                  ) {
                    navigation.navigate(
                      route.name
                    );
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                return (
                  <Pressable
                    key={route.key}
                    accessibilityRole="tab"
                    accessibilityState={{
                      selected: focused,
                    }}
                    accessibilityLabel={
                      options.tabBarAccessibilityLabel
                    }
                    testID={
                      options.tabBarButtonTestID
                    }
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={styles.tab}
                  >
                    <View style={styles.tabContent}>
                      <Ionicons
                        name={iconName}
                        size={focused ? 23 : 22}
                        color={color}
                      />

                      <Text
                        style={[
                          styles.label,
                          {
                            color,
                            fontWeight: focused
                              ? '700'
                              : '500',
                          },
                        ]}
                      >
                        {options.title ??
                          route.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              }
            )}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <LiquidGlassTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
        }}
      />

      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',

    left: 30,
    right: 30,

    height: 78,

    alignItems: 'center',
  },

  barShadow: {
    width: '100%',
    height: '100%',

    borderRadius: 39,

    overflow: 'hidden',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.16,

    shadowRadius: 24,

    elevation: 18,
  },

  blur: {
    flex: 1,

    borderRadius: 39,

    overflow: 'hidden',

    /*
     * Main glass transparency
     */
    backgroundColor:
      'rgba(255,255,255,0.20)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.60)',
  },

  /*
   * Thin reflection across the top
   */
  glassHighlight: {
    position: 'absolute',

    top: 1,

    left: 18,

    right: 18,

    height: 1,

    borderRadius: 1,

    backgroundColor:
      'rgba(255,255,255,0.95)',
  },

  tabsContainer: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 5,
  },

  tab: {
    flex: 1,

    height: '100%',

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 2,
  },

  tabContent: {
    width: TAB_WIDTH,

    height: 60,

    alignItems: 'center',

    justifyContent: 'center',

    gap: 2,
  },

  /*
   * Moving glass capsule
   */
  activeGlass: {
    position: 'absolute',

    top: 9,

    width: TAB_WIDTH,

    height: 60,

    borderRadius: 30,

    /*
     * Transparent active glass
     */
    backgroundColor:
      'rgba(255,255,255,0.38)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.75)',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.10,

    shadowRadius: 10,

    elevation: 5,

    zIndex: 1,
  },

  /*
   * Small reflection inside active glass
   */
  activeInner: {
    position: 'absolute',

    top: 2,

    left: 8,

    right: 8,

    height: 1,

    backgroundColor:
      'rgba(255,255,255,0.95)',

    borderRadius: 1,
  },

  label: {
    fontSize: 10,

    letterSpacing: 0.1,
  },
});
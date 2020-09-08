import { IconName } from '@blueprintjs/icons';

export type RouteType = {
  path: string;
  name: string;
  iconName: IconName;
};

export type RoutesType = {
  [key: string]: RouteType;
};

export const routes: RoutesType = {
  HOME: {
    path: '/',
    name: 'sidebar.home',
    iconName: 'home'
  },
  EXTRACT_FRAMES: {
    path: '/extract-frames',
    name: 'sidebar.extractFrames',
    iconName: 'mobile-video'
  },
  CLASSIFY: {
    path: '/classify',
    name: 'sidebar.classify',
    iconName: 'send-to-graph'
  },
  EXPLORE: {
    path: '/explore',
    name: 'sidebar.explore',
    iconName: 'search-template'
  }
};

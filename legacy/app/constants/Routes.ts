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
  MEDIA_TOOLS: {
    path: '/media-tools',
    name: 'sidebar.mediaTools',
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

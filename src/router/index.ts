import { createRouter, createWebHistory } from 'vue-router';

export const routePath = {
	home: '/',
	about: '/about',
	game: '/game',
	leaderBoard: '/leader-board',
	statistics: '/statistics',
} satisfies Record<string, string>;

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: routePath.home,
			name: 'home',
			component: () => import('@/views/home-view'),
		},
		{
			path: routePath.game,
			name: 'game',
			component: () => import('@/views/game-view'),
		},
		{
			path: routePath.about,
			name: 'about',
			component: () => import('@/views/about-view'),
		},
		{
			path: routePath.leaderBoard,
			name: 'leader-board',
			component: () => import('@/views/leader-board-view'),
		},
		{
			path: routePath.statistics,
			name: 'statistics',
			component: () => import('@/views/statistics-view'),
		},
	],
});

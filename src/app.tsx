import { defineComponent } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import styles from '@/app.module.css';
import { routePath } from '@/router';

export const App = defineComponent({
	render() {
		return (
			<>
				<header>
					<div class={styles.wrapper}>
						<nav>
							<RouterLink to={routePath.home}>Home</RouterLink>
							<RouterLink to={routePath.about}>About</RouterLink>
							<RouterLink to={routePath.game}>Game</RouterLink>
							<RouterLink to={routePath.leaderBoard}>About</RouterLink>
						</nav>
					</div>
				</header>

				<RouterView />
			</>
		);
	},
});

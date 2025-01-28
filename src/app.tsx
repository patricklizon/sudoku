import { defineComponent } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import styles from './app.module.css';

export const App = defineComponent({
	render() {
		return (
			<>
				<header>
					<img
						alt="Vue logo"
						class={styles.logo}
						src="@/assets/logo.svg"
						width="125"
						height="125"
					/>

					<div class={styles.wrapper}>
						<nav>
							<RouterLink to="/">Home</RouterLink>
							<RouterLink to="/about">About</RouterLink>
						</nav>
					</div>
				</header>

				<RouterView />
			</>
		);
	},
});

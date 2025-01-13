import { defineComponent } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import styles from './app.module.css';
import { createGrid } from './lib/game/_sudoku';

export const App = defineComponent({
	setup() {
		console.log(createGrid());
	},
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
						{/* <HelloWorld msg="You did it!" /> */}

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

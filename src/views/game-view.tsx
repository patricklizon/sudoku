import { defineComponent } from 'vue';
import styles from './about-view.module.css';

export const GameView = defineComponent({
	render() {
		return (
			<div class={styles.about}>
				<h1>This is a game view</h1>
			</div>
		);
	},
});

export default GameView;

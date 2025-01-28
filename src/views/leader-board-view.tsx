import { defineComponent } from 'vue';
import styles from './about-view.module.css';

const LeaderBoardView = defineComponent({
	render() {
		return (
			<div class={styles.about}>
				<h1>This is a leaderboard view</h1>
			</div>
		);
	},
});

export default LeaderBoardView;

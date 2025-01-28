import { defineComponent } from 'vue';
import styles from './about-view.module.css';

export const StatisticsView = defineComponent({
	render() {
		return (
			<div class={styles.about}>
				<h1>This is a statistics view</h1>
			</div>
		);
	},
});

export default StatisticsView;

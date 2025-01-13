import { defineComponent } from 'vue';
import styles from './about-view.module.css';

export const AboutView = defineComponent({
	setup() {
		return (
			<div class={styles.about}>
				<h1>This is an about page</h1>
			</div>
		);
	},
});

export default AboutView;

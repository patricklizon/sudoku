import { defineComponent } from 'vue';
import styles from './about-view.module.css';

const AboutView = defineComponent({
	render() {
		return (
			<div class={styles.about}>
				<h1>This is an about page</h1>
			</div>
		);
	},
});

export default AboutView;

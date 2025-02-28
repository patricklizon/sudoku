import { defineComponent } from 'vue';
import { CreatePuzzleService } from '@/lib/services/create-puzzle/service';
import { DIFFICULTY_LEVEL } from '@/lib/domain/puzzle/difficulty';

let service: InstanceType<typeof CreatePuzzleService>;

export const App = defineComponent({
	beforeMount() {
		service = new CreatePuzzleService();
	},
	render() {
		return (
			<>
				<button
					onClick={() => {
						performance.mark('start');
						service
							.create(DIFFICULTY_LEVEL[3])
							.then((it) => {
								console.log(it.payload.puzzle.id);
								performance.mark('end');
								performance.measure('x', 'start', 'end');
								const measure = performance.getEntriesByName('x');
								console.log(measure.at(0)?.duration);
								performance.clearMeasures();
							})
							.catch(console.error);
					}}
				>
					go
				</button>
				<div>hello</div>
			</>
		);
	},
});

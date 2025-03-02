import { defineComponent } from 'vue';
import { CreatePuzzleService } from '@/lib/services/create-puzzle/service';
import { DIFFICULTY_LEVEL } from '@/lib/domain/puzzle/difficulty';
import { debug } from '@/lib/domain/puzzle/grid';
import { isDefined } from '@/lib/utils/is-defined';

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
							.create(DIFFICULTY_LEVEL[4])
							.then((it) => {
								console.log(
									debug(it.payload.puzzle.problem),
									it.payload.puzzle.problem.filter(isDefined).length,
								);
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

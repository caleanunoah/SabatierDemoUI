export type Datapoint = {
	time: number,	// In seconds
	value: number	// In whatever units are specified by the Dataclass
};

export type Dataseries = {
	name: string,	// Ex. Mixer
	id: number,		// Ex. 1
	data: Array<Datapoint>
};

export type Dataset = {
	name: string,	// Ex. Temperature
	id: number,	 	// Ex. 1
	units: string,	// Ex. Celsius
	series: Array<Dataseries>
}

/*
 * Type guard to distinguish between dataclass and dataset
 */
export function is_dataset(data: Dataset | Dataseries): data is Dataset {
	return (data as Dataset).units !== undefined;
}
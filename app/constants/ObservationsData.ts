type Observation = {
  date: string;
  pred_1: string;
  score_1: number;
  station: string;
  check: string;
  camera: string;
  coordinates_lat: number;
  coordinates_long: number;
};

type ObservationsData = {
  observations: Observation[];
};

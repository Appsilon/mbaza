type Observation = {
  location: string;
  date: string;
  pred_1: string;
  score_1: number;
  pred_2: string;
  score_2: number;
  pred_3: string;
  score_3: number;
  station: string;
  check: string;
  camera: string;
  coordinates_lat: number;
  coordinates_long: number;
  project_id: string;
  deployment_id: string;
};

type ObservationsData = {
  observations: Observation[];
};

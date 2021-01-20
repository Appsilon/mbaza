type Observation = {
  // WCS columns
  project_id: string;
  deployment_id: string;
  location: string;
  identified_by: string;
  wi_taxon_id: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  common_name: string;
  uncertainty: number;
  // Metedata columns
  station: string;
  check: string;
  camera: string;
  date: string;
  coordinates_long: number;
  coordinates_lat: number;
  // Score columns
  pred_1: string;
  score_1: number;
  pred_2: string;
  score_2: number;
  pred_3: string;
  score_3: number;
};

type ObservationsData = {
  observations: Observation[];
};

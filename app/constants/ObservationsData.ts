type Observation = {
  exif_datetime: string;
  pred_1: string;
  score_1: string;
  station: string;
  check: string;
  camera: string;
  exif_gps_lat: string;
};

type ObservationsData = {
  observations: Observation[];
};

type Observation = {
  exif_datetime: string;
  pred_1: string;
  score_1: number;
  station: string;
  check: string;
  camera: string;
  exif_gps_lat: number;
  exif_gps_long: number;
};

type ObservationsData = {
  observations: Observation[];
};

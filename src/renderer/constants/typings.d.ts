type Observation = {
  // WCS attributes
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
  label: string;
  // Metadata
  station: string;
  camera: string;
  date: string;
  coordinates_long: number;
  coordinates_lat: number;
  timestamp: Date;
  event_id: number | undefined;
  event_photo: number | undefined;
  // Scores
  pred_1: string;
  score_1: number;
  pred_2: string;
  score_2: number;
  pred_3: string;
  score_3: number;
};

type CreatableOption = {
  value: string;
  label: string;
  __isNew__?: boolean;
};

type PredictionOverridesMap = Record<string, CreatableOption>;

type PredictionsOverrideHandler = (location: string[], prediction: CreatableOption | null) => void;

type Predictions = (string | number)[][];

type PredictionOverrideWrapperProps = {
  observation?: Observation;
  predictionOverride?: CreatableOption;
  onPredictionsOverride?: PredictionsOverrideHandler;
};

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionsOverride: PredictionsOverrideHandler;
  photosPath: string;
};

type ObservationCardProps = {
  observation: Observation;
  observationIndex: number;
  isSelected: boolean;
  isSelectionMode: boolean;
  photosPath: string;
  onCardSelect: (cardIndex: number, cardSelected: boolean) => void;
  onPhotoClick: (cardIndex: number | null, cardSelected: boolean) => void;
  overrideWidget: React.ReactNode;
};

type MaximizedObservationCardProps = {
  observation: Observation;
  observationIndex: number;
  photosPath: string;
  onPrevious: (currentIndex: number) => void;
  onNext: (currentIndex: number) => void;
  onPhotoClick: (cardIndex: number | null, cardSelected: boolean) => void;
  overrideWidget: React.ReactNode;
};

type PhotoDetails = {
  observation: Observation;
  maximized: boolean;
};

type PhotoDetail = {
  label: string;
  value: string;
};

type PredictionsTable = {
  predictions: Predictions;
  maximized: boolean;
};

type ObservationsHeaderProps = {
  observations: Observation[];
  maximizedCardIndex: number | null;
  selectedCardsTotal: number;
  onBackButtonClick: () => void;
  onPredictionsOverride: (override: CreatableOption | null) => void;
};

type Entry = {
  label: string;
  value: string;
};

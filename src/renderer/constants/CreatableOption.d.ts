type CreatableOption = {
  value: string;
  label: string;
  __isNew__?: boolean;
};

type PredictionOverridesMap = Record<string, CreatableOption>;

type PredictionOverrideHandler = (location: string, prediction: CreatableOption | null) => void;

type PredictionOverrideWrapperProps = {
  observation: Observation;
  predictionOverride?: CreatableOption;
  onPredictionOverride: PredictionOverrideHandler;
};

type ObservationsInspectorProps = {
  observations: Observation[];
  onClose: () => void;
  predictionOverrides: PredictionOverridesMap;
  onPredictionOverride: PredictionOverrideHandler;
};

type ObservationCardProps = {
  observation: Observation;
  observationIndex: number;
  onPhotoClick: (cardIndex: number | null) => void;
  predictionOverrideWrapper: (props: PredictionOverrideWrapperProps) => JSX.Element;
};

type MaximizedObservationCardProps = {
  observation: Observation;
  observationIndex: number;
  lastObservationIndex: number;
  onPhotoClick: (cardIndex: number | null) => void;
  predictionOverrideWrapper: (props: PredictionOverrideWrapperProps) => JSX.Element;
};

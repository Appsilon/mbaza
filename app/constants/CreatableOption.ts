type CreatableOption = {
  value: string;
  label: string;
  __isNew__?: boolean;
};

type PredictionOverridesMap = Record<string, CreatableOption>;

type PredictionOverrideHandler = (location: string, prediction: CreatableOption | null) => void;

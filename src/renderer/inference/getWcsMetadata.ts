import path from 'path';

import { taxonMap } from '../constants/taxons';

const remote = require('@electron/remote');

export default function getWcsMetadata({
  projectId,
  deploymentId,
  location,
  date,
  time,
  prediction,
  score,
}: {
  projectId: string;
  deploymentId: string;
  location: string;
  date: string;
  time: string;
  prediction: string;
  score: number;
}) {
  return {
    project_id: projectId,
    deployment_id: deploymentId,
    image_id: path.parse(location).name,
    location,
    identified_by: `Mbaza-AI-${remote.app.getVersion()}`,
    ...taxonMap[prediction],
    uncertainty: score,
    timestamp: `${date} ${time}`,
    number_of_objects: 1,
    highlighted: undefined,
    age: undefined,
    sex: 'Unknown',
    animal_recognizable: undefined,
    individual_id: undefined,
    individual_animal_notes: undefined,
    markings: undefined,
  };
}

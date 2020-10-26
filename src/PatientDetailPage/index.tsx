import React from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../state';
import { Icon } from 'semantic-ui-react';

const GenderIcon: React.FC<{ gender: string }> = ({ gender }) => {
  switch (gender) {
    case 'male':
      return <Icon name="mars" />;
    case 'female':
      return <Icon name="venus" />;
    case 'other':
      return <Icon name="genderless" />;
  }
  return <Icon name="genderless" />;
};

// https://stackoverflow.com/questions/59085911/required-url-param-on-react-router-v5-with-typescript-can-be-undefined
interface ParamTypes {
  id: string;
}

const PatientDetailPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<ParamTypes>();
  const patient = patients[id];

  const loading = () => (
    <span>
      loading data... <Icon loading name="spinner" />
    </span>
  );

  if (!patient) {
    return loading();
  }

  return (
    <div className="App">
      <h1>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h1>
      <div>ssn: {patient.ssn ? patient.ssn : loading()}</div>
      <div>occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientDetailPage;

import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, addPatient } from '../state';
import { Icon } from 'semantic-ui-react';
import { apiBaseUrl } from '../constants';
import { Patient } from '../types';

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

  const fetchPatientDetails = async (id: string) => {
    try {
      const uri = `${apiBaseUrl}/patients/${id}`;
      const { data: patientDetailsFromApi } = await axios.get<Patient>(uri);
      dispatch(addPatient(patientDetailsFromApi));
    } catch (e) {
      console.error(e);
    }
  };

  if (!patient.ssn) {
    fetchPatientDetails(id);
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

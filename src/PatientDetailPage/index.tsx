import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useStateValue, addPatient } from '../state';
import { Icon } from 'semantic-ui-react';
import { apiBaseUrl } from '../constants';
import { Patient, Gender, Entry, Diagnosis } from '../types';

const GenderIcon: React.FC<{ gender: Gender }> = ({ gender }) => {
  switch (gender) {
    case 'male':
      return <Icon name="mars" />;
    case 'female':
      return <Icon name="venus" />;
    case 'other':
      return <Icon name="genderless" />;
    default:
      return <Icon name="genderless" />;
  }
};

const OneEntry: React.FC<Entry> = (entry) => {
  // console.log(entry);
  const [{ diagnoses }] = useStateValue();
  // console.log(diagnoses);
  return (
    <div>
      <div>
        {entry.date} {entry.description}
      </div>
      <ul>
        {entry.diagnosisCodes?.map((code: Diagnosis['code']) => (
          <li key={code}>{code} {diagnoses[code].name}</li>
        ))}
      </ul>
    </div>
  );
};

const Entries: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  return (
    <div>
      {entries.map((entry: Entry) => (
        <OneEntry key={entry.id} {...entry} />
      ))}
    </div>
  );
};

const PatientDetailPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
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
      // console.log(patientDetailsFromApi);
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
      <div>ssn: {patient.ssn || loading()}</div>
      <div>occupation: {patient.occupation}</div>
      <h2>Entries</h2>
      {patient.entries ? <Entries entries={patient.entries} /> : loading()}
    </div>
  );
};

export default PatientDetailPage;
